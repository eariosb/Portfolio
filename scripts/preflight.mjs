import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT  = path.resolve(__dirname, "..");
const FIX   = process.argv.includes("--fix");

let errors = 0, warnings = 0, fixes = 0;
const pass  = (m) => console.log("  ✅ " + m);
const fail  = (m) => { console.log("  ❌ " + m); errors++; };
const warn  = (m) => { console.log("  ⚠️  " + m); warnings++; };
const fixed = (m) => { console.log("  🔧 FIXED: " + m); fixes++; };
const sec   = (t) => console.log("\n── " + t + " ──");

const major = (v) => parseInt((v ?? "0").replace(/[^\d.]/g, "").split(".")[0]);
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const readJ  = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));

function flatKeys(obj, pre) {
  pre = pre || "";
  return Object.entries(obj).flatMap(function([k, v]) {
    return (typeof v === "object" && v !== null)
      ? flatKeys(v, pre + k + ".")
      : [pre + k];
  });
}

// 1. Lockfile
sec("Lockfile");
const lockPath = path.join(ROOT, "package-lock.json");
if (fs.existsSync(lockPath)) {
  try {
    const lock = readJ("package-lock.json");
    const pkgs = lock.packages || {};
    const corrupt = Object.entries(pkgs).filter(function([, v]) {
      return v && !v.version && !v.link && !v.optional && Object.keys(v).length > 0;
    });
    if (corrupt.length > 5) {
      fail("package-lock.json corrupto: " + corrupt.length + " paquetes sin version");
      if (FIX) {
        try { fs.unlinkSync(lockPath); fixed("package-lock.json eliminado"); }
        catch (e) { fail("No se pudo eliminar lockfile desde sandbox. Ejecuta en PowerShell: Remove-Item package-lock.json"); }
      } else {
        console.log("  💡 PowerShell: Remove-Item package-lock.json");
        console.log("  💡 O ejecuta:  npm run preflight:fix");
      }
    } else {
      pass("package-lock.json OK (" + Object.keys(pkgs).length + " paquetes)");
    }
  } catch(e) { warn("No se pudo parsear package-lock.json"); }
} else {
  pass("Sin lockfile (se generara limpio en npm install)");
}

// 2. Versiones
sec("Versiones y compatibilidad");
const pkg  = readJ("package.json");
const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

const rV  = (deps["react"]     || "").replace(/[^\d.]/g, "");
const rdV = (deps["react-dom"] || "").replace(/[^\d.]/g, "");
if (rV && rdV && rV !== rdV)
  fail("react@" + rV + " != react-dom@" + rdV);
else
  pass("react y react-dom alineados: " + rV);

const nMaj  = major(deps["next"] || "0");
const niMaj = major(deps["next-intl"] || "0");
if (nMaj >= 16 && niMaj <= 3)
  fail("next-intl@" + niMaj + ".x no soporta Next.js@" + nMaj + " — usa next-intl@4+");
else
  pass("next-intl@" + niMaj + ".x compatible con Next.js@" + nMaj + ".x");

if (deps["@tailwindcss/postcss"] && !deps["jiti"])
  fail("jiti faltante — peer dep de @tailwindcss/postcss v4");
else
  pass("jiti presente");

const dangerRanges = ["next","react","react-dom"].filter(n => (deps[n] || "").startsWith("^"));
if (dangerRanges.length)
  warn("Deps criticos con ^: " + dangerRanges.join(", "));
else
  pass("next/react/react-dom usan versiones exactas");

// 3. Archivos
sec("Archivos de configuracion");
["next.config.ts","tsconfig.json","postcss.config.mjs","src/middleware.ts",
 "src/i18n/routing.ts","src/i18n/request.ts","messages/es.json","messages/en.json"
].forEach(function(f) { exists(f) ? pass(f) : fail("Faltante: " + f); });

// 4. i18n
sec("i18n paridad ES vs EN");
try {
  const es = readJ("messages/es.json");
  const en = readJ("messages/en.json");
  const esK = new Set(flatKeys(es)), enK = new Set(flatKeys(en));
  const misEn = Array.from(esK).filter(function(k) { return !enK.has(k); });
  const misEs = Array.from(enK).filter(function(k) { return !esK.has(k); });
  misEn.length ? fail("Claves ES sin EN: " + misEn.join(", ")) : pass("ES -> EN completo");
  misEs.length ? fail("Claves EN sin ES: " + misEs.join(", ")) : pass("EN -> ES completo");
  pass(esK.size + " claves i18n");
} catch(e) { fail("Error leyendo mensajes: " + e.message); }

// 5. Rutas
sec("Rutas App Router");
const ld = "src/app/[locale]";
[ld+"/page.tsx", ld+"/layout.tsx",
 ld+"/blog/page.tsx", ld+"/blog/[slug]/page.tsx",
 ld+"/portfolio/page.tsx", ld+"/portafolio/page.tsx",
 ld+"/courses/page.tsx",  ld+"/cursos/page.tsx",
 ld+"/contact/page.tsx",  ld+"/contacto/page.tsx",
 "src/app/layout.tsx",    "src/app/page.tsx"
].forEach(function(f) { exists(f) ? pass(f.split("/").pop()) : fail("Falta: " + f); });

// 6. Componentes
sec("Componentes");
["src/components/Navbar.tsx","src/components/Footer.tsx",
 "src/components/ProjectCard.tsx","src/components/SectionHeading.tsx",
 "src/components/icons/BrandIcons.tsx",
 "src/data/projects.ts","src/data/courses.ts",
 "src/lib/utils.ts","src/lib/blog.ts"
].forEach(function(f) { exists(f) ? pass(f.split("/").pop()) : fail("Faltante: " + f); });

// 7. Contenido
sec("Contenido");
try {
  const code = fs.readFileSync(path.join(ROOT,"src/data/projects.ts"),"utf8");
  const n = (code.match(/id: "/g) || []).length;
  n >= 3 ? pass(n + " proyectos") : warn("Solo " + n + " proyectos");
} catch(e) { fail("projects.ts no encontrado"); }

try {
  const posts = fs.readdirSync(path.join(ROOT,"src/content/blog")).filter(function(f) { return f.endsWith(".mdx"); });
  posts.length > 0 ? pass(posts.length + " posts MDX") : warn("Blog vacio");
} catch(e) { warn("Directorio blog no encontrado"); }

// 8. Iconos eliminados en lucide-react 1.x
sec("lucide-react: iconos de marca eliminados v1.x");
const REMOVED = ["Github","Linkedin","Twitter","Facebook","Instagram","Youtube","Discord"];
try {
  function walkTs(dir) {
    var r = [];
    for (var e of fs.readdirSync(dir, { withFileTypes: true })) {
      var fp = path.join(dir, e.name);
      if (e.isDirectory()) r = r.concat(walkTs(fp));
      else if (e.name.match(/\.(tsx|ts)$/)) r.push(fp);
    }
    return r;
  }
  var files = walkTs(path.join(ROOT, "src"));
  var found = false;
  for (var file of files) {
    var code = fs.readFileSync(file, "utf8");
    var m = code.match(/import\s*\{([^}]+)\}\s*from ['"]lucide-react['"]/);
    if (!m) continue;
    var icons = m[1].split(",").map(function(s) { return s.trim().split(/\s+as\s+/)[0].trim(); });
    var bad = icons.filter(function(i) { return REMOVED.includes(i); });
    if (bad.length) {
      fail(path.relative(ROOT, file) + ": iconos eliminados: " + bad.join(", ") + " -> usa BrandIcons.tsx");
      found = true;
    }
  }
  if (!found) pass("Sin iconos de marca eliminados");
} catch(e) { warn("No se pudo escanear iconos: " + e.message); }

// Resumen
console.log("\n" + "─".repeat(54));
if (errors === 0) {
  if (fixes > 0)    console.log("🔧 " + fixes + " correcciones aplicadas");
  if (warnings > 0) console.log("⚠️  " + warnings + " advertencias");
  console.log("\uD83D\DE80 Preflight OK\n");
} else {
  console.log("❌ " + errors + " error(es) bloqueantes");
  if (warnings > 0) console.log("⚠️  " + warnings + " advertencias");
  if (!FIX)         console.log("\n💡 Prueba: npm run preflight:fix");
  console.log();
}
process.exit(errors > 0 ? 1 : 0);
