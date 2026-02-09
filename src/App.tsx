import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

/**
 * Countdown – Saída do CLT (America/Sao_Paulo)
 * - Tema divertido / alegre
 * - Piadas leves e sátiras do “regime CLT”
 * - Animated background com “papéis”, café, relógio, etc.
 * - Live countdown + barra de progresso
 * - Confetti quando chegar o grande dia 🎉
 */

export default function CLTCountdown() {
  // Target date: 01 May 2026, 00:00 São Paulo time (UTC-03:00)
  const target = useMemo(() => new Date("2026-05-01T00:00:00-03:00"), []);

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

  // Confetti quando finalizar
  useEffect(() => {
    if (!done) return;

    const duration = 6 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        startVelocity: 28,
        spread: 360,
        ticks: 70,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#f59e0b", "#a78bfa", "#38bdf8", "#ffffff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [done]);

  // Barra de progresso (do momento que abriu a página até a data alvo)
  const [startMs] = useState(() => Date.now());
  const totalJourney = Math.max(target.getTime() - startMs, 1);
  const progress = 1 - totalMs / totalJourney;

  const prettyTarget = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(target);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(50rem_40rem_at_15%_-10%,rgba(56,189,248,0.20),transparent),radial-gradient(40rem_35rem_at_85%_10%,rgba(167,139,250,0.20),transparent),linear-gradient(180deg,#06070b,#0b0c12)]">
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-wide uppercase text-white/80"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Operação: Adeus CLT
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Contagem regressiva pro <span className="text-emerald-300">último ponto</span> ✅
            </h1>

            <p className="text-white/70 text-sm md:text-base">
              Dia oficial da liberdade:{" "}
              <span className="font-semibold text-sky-200">{prettyTarget}</span>{" "}
              (Horário de São Paulo)
            </p>

            <JokeTicker done={done} />
          </header>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <TimeCard label="Dias" value={days} icon="📆" />
            <TimeCard label="Horas" value={hours} icon="⏱️" />
            <TimeCard label="Minutos" value={minutes} icon="☕" />
            <TimeCard label="Segundos" value={seconds} icon="🧾" />
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs text-white/60">
              <span>Fase atual: “só mais um alinhamento rapidinho…”</span>
              <span>{Math.max(0, Math.min(100, Math.round(progress * 100)))}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
                style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="yay"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-center"
              >
                <p className="text-lg md:text-xl font-semibold text-emerald-200">
                  CHEGOU O DIA! 🎉
                </p>
                <p className="mt-2 text-white/75">
                  Agora é oficialmente permitido dizer:{" "}
                  <span className="text-sky-200 font-semibold">“reunião? só se for no happy”</span>.
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 text-center text-white/70"
              >
                Contando os dias pra trocar o{" "}
                <span className="text-white font-semibold">“bom dia, equipe”</span> por{" "}
                <span className="text-emerald-200 font-semibold">“bom dia, vida”</span> 😄
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <MiniBadge title="Sem ponto" desc="Relógio agora é só pra ver a hora do almoço." emoji="🕺" />
            <MiniBadge title="Sem dress code" desc="Se quiser, trabalha de moletom e vitória." emoji="🧥" />
            <MiniBadge title="Sem “rapidinho”" desc="Nada dura menos que 1h. Exceto a liberdade." emoji="⚡" />
          </div>
        </motion.div>

        <FooterBadge />
      </main>

      <StyleTag />
    </div>
  );
}

function TimeCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <motion.div
      className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="text-xl opacity-90" aria-hidden>
          {icon}
        </span>
        <span className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
          {padded}
        </span>
      </div>
      <div className="text-xs uppercase tracking-wider text-white/70">{label}</div>

      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(20rem_8rem_at_50%_-20%,rgba(56,189,248,0.18),transparent)]" />
    </motion.div>
  );
}

function JokeTicker({ done }: { done: boolean }) {
  const jokes = useMemo(
    () => [
      "🧾 Faturar não é só um botão. É conferir, reconferir e desconfiar.",
      "📄 Se faturar fosse fácil, não existiria a frase: 'deixa eu validar uma coisa'.",
      "⚠️ Nota ok… até alguém achar um detalhe às 17:59.",
      "🔍 Faturamento: onde o erro aparece só depois de tudo certo.",
      "📎 Faturar não é apertar botão, é apertar o coração.",
      "⏳ Só mais um minutinho = refazer tudo.",
      "💸 Valor certo, imposto certo… ansiedade errada.",
      "🧠 Faturamento não dorme. Ele só fecha o sistema.",
      "📑 Quem trabalha no faturamento aprende a ler até pensamento.",
      "🚫 Botão existe. O problema é tudo antes e tudo depois dele."
    ],
    []
  );

  const [i, setI] = useState(0);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setI((p) => (p + 1) % jokes.length), 4200);
    return () => clearInterval(id);
  }, [done, jokes.length]);

  return (
    <div className="mt-2 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={done ? "done" : i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
        >
          {done ? "🎊 CLT finalizado com sucesso. Parabéns pela atualização de vida!" : jokes[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MiniBadge({
  title,
  desc,
  emoji,
}: {
  title: string;
  desc: string;
  emoji: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <div className="text-xl" aria-hidden>
          {emoji}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/70">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function AnimatedBackground() {
  // “Papéis e vida de escritório” flutuando
  const items = Array.from({ length: 18 }).map((_, i) => ({
    delay: (i % 9) * 0.65,
    x: (i * 57) % 100,
    scale: 0.7 + ((i * 11) % 35) / 100,
    duration: 14 + (i % 6),
    rotate: ((i * 19) % 26) - 13,
    content: pick(["📄", "🧾", "📎", "⏰", "☕", "🧠", "💼", "📌", "✅"], i),
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* subtle grain overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.7\\' numOctaves=\\'2\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.15\\'/></svg>')",
        }}
      />

      {items.map((it, idx) => (
        <motion.div
          key={idx}
          className="absolute select-none"
          style={{ left: `${it.x}%` }}
          initial={{ y: "115%", opacity: 0 }}
          animate={{ y: "-15%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: it.duration, ease: "easeInOut", repeat: Infinity, delay: it.delay }}
        >
          <motion.div
            animate={{ rotate: [it.rotate, -it.rotate, it.rotate] }}
            transition={{ duration: 6 + (idx % 4), repeat: Infinity, ease: "easeInOut" }}
            className="opacity-70"
            style={{ transform: `scale(${it.scale})` }}
          >
            <span className="text-2xl md:text-3xl drop-shadow-[0_0_18px_rgba(56,189,248,0.18)]">
              {it.content}
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* soft spotlight */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[62rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
    </div>
  );
}

function FooterBadge() {
  return <div className="relative mt-6 w-full text-center text-xs text-white/50">Feito com carinho por Julio Cesar</div>;
}

function StyleTag() {
  return (
    <style>{`
      html, body, #root { height: 100%; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
      ::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );
}

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}
