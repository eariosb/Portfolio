import fs from "fs";
import path from "path";
import matter from "gray-matter";
import katex from "katex";

export interface PostMeta {
  slug: string;
  title: string;
  titleEn: string;
  date: string;
  tags: string[];
  excerpt: string;
  excerptEn: string;
  readingTime: number;
}

const postsDir = path.join(process.cwd(), "src/content/blog");

// ── Step 1: extract LaTeX, replace with placeholders ────────────
function extractLatex(src: string): { text: string; map: Map<string, string> } {
  const map = new Map<string, string>();
  let i = 0;

  // Block math $$...$$
  const text = src
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      const key = `__KATEX_BLOCK_${i++}__`;
      try {
        map.set(key, katex.renderToString(math.trim(), { displayMode: true, throwOnError: false }));
      } catch {
        map.set(key, `<span class="katex-error">$$${math}$$</span>`);
      }
      return key;
    })
    // Inline math $...$  (avoid $$ already replaced)
    .replace(/\$([^$\n]+?)\$/g, (_, math) => {
      const key = `__KATEX_INLINE_${i++}__`;
      try {
        map.set(key, katex.renderToString(math.trim(), { displayMode: false, throwOnError: false }));
      } catch {
        map.set(key, `<span class="katex-error">$${math}$</span>`);
      }
      return key;
    });

  return { text, map };
}

// ── Step 2: restore KaTeX HTML after markdown conversion ─────────
function restoreLatex(html: string, map: Map<string, string>): string {
  let out = html;
  for (const [key, value] of map) {
    out = out.split(key).join(value);
  }
  return out;
}

// ── Step 3: Minimal Markdown → HTML ─────────────────────────────
function mdToHtml(md: string): string {
  const { text, map } = extractLatex(md);

  const lines = text.split("\n");
  const out: string[] = [];
  let inUl = false, inOl = false, inPre = false, inBlockquote = false;

  const inline = (s: string) =>
    s
      .replace(/&(?![a-z#\d]+;)/g, "&amp;")
      .replace(/<(?!__KATEX)/g, "&lt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const closeBlock = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl)  { out.push("</ol>"); inOl = false; }
    if (inBlockquote) { out.push("</blockquote>"); inBlockquote = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("```")) {
      closeBlock();
      if (!inPre) { out.push("<pre><code>"); inPre = true; }
      else { out.push("</code></pre>"); inPre = false; }
      continue;
    }
    if (inPre) { out.push(line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")); continue; }

    const h = line.match(/^(#{1,4})\s+(.+)/);
    if (h) { closeBlock(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { closeBlock(); out.push("<hr>"); continue; }

    if (line.startsWith("> ")) {
      if (!inBlockquote) { out.push("<blockquote>"); inBlockquote = true; }
      out.push(`<p>${inline(line.slice(2))}</p>`);
      continue;
    } else if (inBlockquote && line === "") { closeBlock(); }

    const ul = line.match(/^[-*+]\s+(.+)/);
    if (ul) { if (!inUl) { closeBlock(); out.push("<ul>"); inUl = true; } out.push(`<li>${inline(ul[1])}</li>`); continue; }

    const ol = line.match(/^\d+\.\s+(.+)/);
    if (ol) { if (!inOl) { closeBlock(); out.push("<ol>"); inOl = true; } out.push(`<li>${inline(ol[1])}</li>`); continue; }

    if (line === "") { closeBlock(); out.push(""); continue; }

    closeBlock();
    out.push(`<p>${inline(line)}</p>`);
  }

  closeBlock();
  return restoreLatex(out.join("\n"), map);
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data } = matter(raw);
      return { slug: file.replace(".mdx", ""), ...data, tags: data.tags ?? [] } as PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const file = path.join(postsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const html = mdToHtml(content);
  return { meta: { slug, ...data, tags: data.tags ?? [] } as PostMeta, html };
}
