import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 hero-mesh">
      <div className="mono-tag text-[#2A5CFF] mb-4">404</div>
      <h1 className="text-6xl font-black gradient-vivid mb-6">Página no encontrada</h1>
      <p className="text-[#B0C4FF] mb-10 max-w-md leading-relaxed">
        La página que buscas no existe. Pero el portfolio sigue aquí.
      </p>
      <Link href="/es" className="px-6 py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-[0_0_30px_#2A5CFF44]"
        style={{ background: "linear-gradient(135deg, #2A5CFF, #00C2FF)" }}>
        Volver al inicio
      </Link>
    </div>
  );
}
