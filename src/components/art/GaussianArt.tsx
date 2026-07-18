"use client";
// Gaussian distribution curve — decorative right-column art
export function GaussianArt({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 120 }, (_, i) => {
    const x = (i / 119) * 280;
    const t = (i / 119) * 6 - 3;
    const y = 80 - 65 * Math.exp(-(t * t) / 2);
    // Precisión fija: evita hydration mismatch por diferencias
    // de punto flotante entre servidor (Node) y navegador
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 280 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gauss-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A5CFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2A5CFF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gauss-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A5CFF" stopOpacity="0.1" />
          <stop offset="30%" stopColor="#2A5CFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00C2FF" stopOpacity="1" />
          <stop offset="70%" stopColor="#2A5CFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2A5CFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Fill area under curve */}
      <polygon
        points={`0,80 ${pts} 280,80`}
        fill="url(#gauss-fill)"
      />
      {/* Curve line */}
      <polyline
        points={pts}
        fill="none"
        stroke="url(#gauss-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 0,
          animation: "draw-line 2.5s ease-out forwards",
        }}
      />
      {/* μ marker */}
      <line x1="140" y1="15" x2="140" y2="80" stroke="#00C2FF" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
      <text x="143" y="25" fill="#00C2FF" fontSize="9" fontFamily="monospace" opacity="0.7">μ</text>
      {/* σ markers */}
      <line x1="93" y1="50" x2="93" y2="80" stroke="#B0C4FF" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.4" />
      <line x1="187" y1="50" x2="187" y2="80" stroke="#B0C4FF" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.4" />
      <text x="73" y="70" fill="#B0C4FF" fontSize="8" fontFamily="monospace" opacity="0.5">-σ</text>
      <text x="189" y="70" fill="#B0C4FF" fontSize="8" fontFamily="monospace" opacity="0.5">+σ</text>
      {/* Base line */}
      <line x1="0" y1="80" x2="280" y2="80" stroke="#243060" strokeWidth="1" />
    </svg>
  );
}

// Bayesian formula display
export function BayesFormula({ className = "" }: { className?: string }) {
  return (
    <div className={`font-mono text-[#B0C4FF] select-none ${className}`}>
      <div className="text-[10px] text-[#475569] mb-1 tracking-widest">TEOREMA DE BAYES</div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-[#F8FAFF]">P</span>
        <span className="text-[#00C2FF]">(A|B)</span>
        <span className="text-[#B0C4FF] mx-1">=</span>
        <div className="inline-flex flex-col items-center">
          <span className="border-b border-[#2A5CFF] pb-0.5 text-[#2A5CFF]">P(B|A) · P(A)</span>
          <span className="pt-0.5 text-[#B0C4FF] text-xs">P(B)</span>
        </div>
      </div>
    </div>
  );
}

// Floating statistical symbols background art
export function FloatingSymbols() {
  const symbols = [
    { s: "∑", x: "80%",  y: "22%", size: "2.2rem", op: 0.06, delay: 0 },
    { s: "∫", x: "92%", y: "15%", size: "2rem",   op: 0.07, delay: 1.5 },
    { s: "∂", x: "4%",  y: "72%", size: "1.8rem", op: 0.05, delay: 0.7 },
    { s: "σ", x: "88%", y: "65%", size: "2rem",   op: 0.09, delay: 2.1 },
    { s: "μ", x: "50%", y: "8%",  size: "1.6rem", op: 0.07, delay: 1.2 },
    { s: "θ", x: "76%", y: "88%", size: "1.8rem", op: 0.06, delay: 0.4 },
    { s: "λ", x: "18%", y: "88%", size: "1.6rem", op: 0.05, delay: 1.8 },
    { s: "∇", x: "62%", y: "5%",  size: "1.5rem", op: 0.06, delay: 0.9 },
    { s: "π", x: "95%", y: "45%", size: "1.7rem", op: 0.05, delay: 1.4 },
    { s: "β", x: "2%",  y: "48%", size: "1.8rem", op: 0.07, delay: 0.3 },
  ];

  return (
    <>
      {symbols.map(({ s, x, y, size, op, delay }) => (
        <span
          key={`${s}-${x}`}
          className="stat-symbol float-anim-slow pointer-events-none"
          style={{
            left: x, top: y,
            fontSize: size,
            opacity: op,
            animationDelay: `${delay}s`,
          }}
        >
          {s}
        </span>
      ))}
    </>
  );
}

// Soft Dalí-inspired clock silhouette
export function SoftClock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" opacity="0.06">
      <ellipse cx="60" cy="30" rx="35" ry="28" fill="none" stroke="#B0C4FF" strokeWidth="1.5" />
      <line x1="60" y1="30" x2="60" y2="12" stroke="#B0C4FF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="30" x2="74" y2="36" stroke="#B0C4FF" strokeWidth="1" strokeLinecap="round" />
      {/* Melting effect */}
      <path d="M 80 55 Q 85 65 75 72 Q 65 78 60 72 Q 55 65 58 55" fill="#B0C4FF" opacity="0.3" />
      <path d="M 83 52 Q 90 62 82 70" fill="none" stroke="#B0C4FF" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
