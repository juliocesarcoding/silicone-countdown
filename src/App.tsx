import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cute Countdown – 15 Nov (America/Sao_Paulo)
 * - Contemporary, soft-glass UI
 * - Animated gradient background + floating hearts
 * - Live countdown (days / hours / minutes / seconds)
 * - Subtle progress bar toward the big day
 * - Works standalone as a React component
 */

export default function CuteCountdown() {
  // Target date: 15 Nov 2025, midnight São Paulo time (UTC-03:00)
  const target = useMemo(() => new Date("2025-11-14T08:00:00-03:00"), []);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, totalMs, done } = useMemo(() => {
    const diff = target.getTime() - now.getTime();
    const clamped = Math.max(0, diff);
    const d = Math.floor(clamped / (1000 * 60 * 60 * 24));
    const h = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const m = Math.floor((clamped / (1000 * 60)) % 60);
    const s = Math.floor((clamped / 1000) % 60);
    return { days: d, hours: h, minutes: m, seconds: s, totalMs: clamped, done: diff <= 0 };
  }, [now, target]);

  // For progress bar (from component mount until target)
  const [startMs] = useState(() => Date.now());
  const totalJourney = Math.max(target.getTime() - startMs, 1);
  const progress = 1 - totalMs / totalJourney; // 0..1 from "now" until target

  const prettyTarget = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(target);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(40rem_40rem_at_20%_-10%,rgba(255,182,193,0.25),transparent),radial-gradient(35rem_35rem_at_80%_10%,rgba(255,192,203,0.25),transparent),linear-gradient(180deg,#0f0f14, #14151c)]">
      <AnimatedBackground />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center p-6">
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-3xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        >
          <header className="flex flex-col items-center gap-3 text-center">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-wide uppercase text-pink-100/90"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
              Contagem do Amor
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Rumo ao dia do <span className="text-pink-300">novo silicone</span> 💖
            </h1>
            <p className="text-white/70 text-sm md:text-base">
              Até <span className="font-semibold text-pink-200">{prettyTarget}</span> (Horário de São Paulo)
            </p>
          </header>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <TimeCard label="Dias" value={days} />
            <TimeCard label="Horas" value={hours} />
            <TimeCard label="Minutos" value={minutes} />
            <TimeCard label="Segundos" value={seconds} />
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Quase lá…</span>
              <span>{Math.max(0, Math.min(100, Math.round(progress * 100)))}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400"
                style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.p
                key="yay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-center text-lg md:text-xl font-semibold text-pink-200"
              >
                Chegou o grande dia! ✨ Que seja perfeito e cheio de carinho.
              </motion.p>
            ) : (
              <motion.p
                key="msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-center text-white/70"
              >
                Preparando tudo com amor para que  se sinta ainda mais <span className="text-pink-200">linda</span>.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <FooterBadge />
      </main>

      <StyleTag />
    </div>
  );
}

function TimeCard({ label, value }: { label: string; value: number }) {
  const padded = String(value).padStart(2, "0");
  return (
    <motion.div
      className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
          {padded}
        </span>
      </div>
      <div className="text-xs uppercase tracking-wider text-white/70">{label}</div>

      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(20rem_8rem_at_50%_-20%,rgba(255,182,193,0.20),transparent)]" />
    </motion.div>
  );
}

function AnimatedBackground() {
  // A field of floating hearts + sparkles
  const hearts = Array.from({ length: 16 }).map((_, i) => ({
    delay: (i % 8) * 0.7,
    x: (i * 61) % 100, // spread across the screen
    scale: 0.6 + ((i * 13) % 40) / 100,
    duration: 14 + (i % 5),
    rotate: ((i * 23) % 20) - 10,
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* subtle grain overlay */}
      <div className="absolute inset-0 mix-blend-overlay opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.7\\' numOctaves=\\'2\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.15\\'/></svg>')" }} />

      {hearts.map((h, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ left: `${h.x}%` }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: h.duration, ease: "easeInOut", repeat: Infinity, delay: h.delay }}
        >
          <motion.div
            animate={{ rotate: [h.rotate, -h.rotate, h.rotate] }}
            transition={{ duration: 6 + (idx % 4), repeat: Infinity, ease: "easeInOut" }}
            className="opacity-70"
          >
            <HeartSVG className="w-7 h-7 md:w-9 md:h-9" style={{ transform: `scale(${h.scale})` }} />
          </motion.div>
        </motion.div>
      ))}

      {/* soft spotlight to center */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/5 blur-3xl" />
    </div>
  );
}

function HeartSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <path
        d="M12 21s-6.716-4.54-9.092-7.064C1.01 11.93 1.184 8.74 3.343 6.808A5.5 5.5 0 0 1 12 7.2a5.5 5.5 0 0 1 8.657-.392c2.159 1.932 2.334 5.123.435 7.128C18.716 16.46 12 21 12 21z"
        fill="url(#g)"
        opacity="0.95"
      />
      <circle cx="9" cy="7" r="1.1" fill="#fff" opacity="0.6" />
    </svg>
  );
}

function FooterBadge() {
  return (
    <div className="relative mt-6 w-full text-center text-xs text-white/50">
      Feito com carinho por Julio Cesar
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      /* Hide scrollbars on fancy background overflow */
      html, body, #root { height: 100%; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
      ::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );
}
