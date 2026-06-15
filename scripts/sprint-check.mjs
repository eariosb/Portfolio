/**
 * sprint-check.mjs — Validación completa de sprint para el portfolio
 * Uso: node scripts/sprint-check.mjs
 *
 * Corre preflight + chequeos de TypeScript + coherencia de datos
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run  = (cmd) => { try { return execSync(cmd, { cwd: ROOT, encoding: "utf8" }); } catch (e) { return e.stdout + e.stderr; } };
const sec  = (t)   => console.log(`\n${"═".repeat(54)}\n  ${t}\n${"═".repeat(54)}`);

console.log("\n🏃 SPRINT CHECK — Portfolio Esneider Ríos\n");

// ─── 1. Preflight ──────────────────────────────────────────────────────────
sec("1/4  Preflight (deps, config, i18n, rutas)");
const preOut = run("node scripts/preflight.mjs");
console.log(preOut);

// ─── 2. TypeScript check ──────────────────────────────────────────────────
sec("2/4  TypeScript");
if (!fs.existsSync(path.join(ROOT, "node_modules/.bin/tsc"))) {
  console.log("  ⏭  Omitido — node_modules no instalado (ejecuta npm install primero)");
} else {
  const tsOut = run("npx tsc --noEmit --pretty 2>&1");
  if (tsOut.trim() === "") {
    console.log("  ✅ Sin errores de TypeScript");
  } else {
    const lines = tsOut.split("\n").filter(Boolean);
    const errs  = lines.filter(l => l.includes("error TS"));
    errs.length > 0
      ? errs.forEach(l => console.log(`  ❌ ${l.trim()}`))
      : console.log("  ✅ TypeScript OK");
  }
}

// ─── 3. Coherencia de datos ────────────────────────────────────────────────
sec("3/4  Coherencia de datos");

// Verificar que cada proyecto tiene URL real (no placeholder)
try {
  const code = fs.readFileSync(path.join(ROOT, "src/data/projects.ts"), "utf8");
  const urls = [...code.matchAll(/url: "([^"]+)"/g)].map(m => m[1]);
  const placeholders = urls.filter(u => u.includes("tu-app") || u.includes("tu-curso") || u.includes("example"));
  placeholders.length > 0
    ? console.log(`  ⚠️  ${placeholders.length} URL(s) placeholder — actualiza con URLs reales:\n     ${placeholders.join("\n     ")}`)
    : console.log(`  ✅ ${urls.length} URLs de proyectos verificadas`);
} catch { console.log("  ⚠️  No se pudo verificar URLs de proyectos"); }

// Verificar que los posts MDX tienen frontmatter completo
try {
  const blogDir = path.join(ROOT, "src/content/blog");
  const posts   = fs.readdirSync(blogDir).filter(f => f.endsWith(".mdx"));
  const required = ["title","titleEn","date","tags","excerpt","excerptEn","readingTime"];
  let ok = 0, issues = 0;
  for (const post of posts) {
    const content = fs.readFileSync(path.join(blogDir, post), "utf8");
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
    const missing = required.filter(k => !frontmatter.includes(`${k}:`));
    if (missing.length > 0) {
      console.log(`  ⚠️  ${post}: falta frontmatter: ${missing.join(", ")}`);
      issues++;
    } else { ok++; }
  }
  console.log(`  ✅ ${ok}/${posts.length} posts con frontmatter completo`);
} catch { console.log("  ⚠️  No se pudo verificar posts MDX"); }

// ─── 4. Build lint ────────────────────────────────────────────────────────
sec("4/4  ESLint (código limpio)");
if (!fs.existsSync(path.join(ROOT, "node_modules/.bin/next"))) {
  console.log("  ⏭  Omitido — node_modules no instalado");
} else {
  const lintOut = run("npx next lint --quiet 2>&1");
  const lintErrors = lintOut.split("\n").filter(l => l.includes("Error:") || l.includes("error"));
  lintErrors.length > 0
    ? lintErrors.slice(0, 5).forEach(l => console.log(`  ❌ ${l.trim()}`))
    : console.log("  ✅ Sin errores de lint");
}

console.log(`\n${"═".repeat(54)}`);
console.log("  Sprint check completo\n");
