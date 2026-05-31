import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { FLAVORS, type Flavor } from "@/data/flavors";

const LAYER_COLORS: Record<string, string> = {
  matcha: "#7bbf5a",
  milk: "#f5ecdc",
  strawberry: "#e63956",
  blueberry: "#5a2a8a",
  mango: "#ffa634",
};

const LAYER_LABEL: Record<string, string> = {
  matcha: "Ceremonial matcha",
  milk: "Cold whole milk",
  strawberry: "Strawberry compote",
  blueberry: "Wild blueberry",
  mango: "Alphonso mango",
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function BeverageShowcase() {
  const [index, setIndex] = useState(0);
  const current = FLAVORS[index];

  const select = (i: number) => setIndex(mod(i, FLAVORS.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") select(index + 1);
      if (e.key === "ArrowLeft") select(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold || info.velocity.x < -400) select(index + 1);
    else if (info.offset.x > threshold || info.velocity.x > 400) select(index - 1);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Atmospheric background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% 35%, ${current.bgTo} 0%, ${current.bgFrom} 55%, #07140d 100%)`,
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="font-display text-xl tracking-[0.25em] text-foreground/90 md:text-2xl">
          MATCHA<span className="opacity-50"> · </span>STATION
        </div>
        <button className="rounded-full border border-foreground/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-foreground/80 transition hover:bg-foreground/10">
          Order · 0
        </button>
      </header>

      {/* Stage */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pt-4 md:pt-8">
        {/* Flavor name */}
        <div className="relative z-20 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-name"}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                {current.tagline}
              </span>
              <h1 className="font-display text-5xl tracking-tight text-foreground md:text-7xl">
                {current.name}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Drink + layer legend */}
        <motion.div
          className="relative mt-2 flex w-full cursor-grab items-end justify-center active:cursor-grabbing md:mt-4"
          drag="x"
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          style={{ touchAction: "pan-y" }}
        >
          {/* Layer legend (desktop left) */}
          <div className="absolute left-2 top-1/2 hidden -translate-y-1/2 md:block">
            <LayerLegend flavor={current} align="left" />
          </div>

          {/* The glass */}
          <div className="relative">
            {/* Glow halo */}
            <motion.div
              key={current.id + "-glow"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${current.glow} 0%, transparent 65%)`,
                filter: "blur(28px)",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id + "-img"}
                src={current.image}
                alt={current.name}
                draggable={false}
                initial={{ y: 30, opacity: 0, scale: 0.96 }}
                animate={{
                  y: [0, -10, 0],
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ y: -20, opacity: 0, scale: 0.96 }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                }}
                className="drag-none h-[44vh] max-h-[520px] w-auto select-none object-contain md:h-[58vh]"
                style={{
                  filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 30px ${current.glow})`,
                }}
              />
            </AnimatePresence>
            {/* Floor reflection */}
            <div
              className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto h-10 w-[65%] rounded-[50%]"
              style={{
                background: `radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)`,
                filter: "blur(10px)",
              }}
            />
          </div>

          {/* Layer legend (mobile bottom-row) is rendered separately below */}
        </motion.div>

        {/* Mobile layer legend */}
        <div className="mt-3 flex w-full justify-center md:hidden">
          <LayerLegend flavor={current} align="center" compact />
        </div>

        {/* Description */}
        <div className="relative z-20 mt-4 max-w-xl px-4 text-center md:mt-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id + "-desc"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-balance text-sm leading-relaxed text-foreground/70 md:text-base"
            >
              {current.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Flavor cards */}
        <div className="relative z-20 mt-6 grid w-full max-w-5xl grid-cols-2 gap-3 px-2 md:mt-10 md:grid-cols-4 md:gap-5">
          {FLAVORS.map((f, i) => (
            <FlavorCard
              key={f.id}
              flavor={f}
              active={i === index}
              onClick={() => select(i)}
            />
          ))}
        </div>

        {/* CTA + price */}
        <div className="relative z-20 mt-6 mb-8 flex items-center gap-5 md:mt-8 md:mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-price"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-2xl text-foreground md:text-3xl"
            >
              {current.price}
            </motion.div>
          </AnimatePresence>
          <button
            className="rounded-full px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-background transition hover:scale-[1.03]"
            style={{
              backgroundColor: current.accent,
              boxShadow: `0 10px 40px -10px ${current.glow}`,
            }}
          >
            Add to Order
          </button>
        </div>

        {/* Swipe hint */}
        <div className="pointer-events-none mb-4 text-[10px] uppercase tracking-[0.4em] text-foreground/30 md:hidden">
          ← swipe to switch →
        </div>
      </main>
    </div>
  );
}

function LayerLegend({
  flavor,
  align,
  compact,
}: {
  flavor: Flavor;
  align: "left" | "center";
  compact?: boolean;
}) {
  // top of glass = last layer in list
  const top = [...flavor.layers].reverse();
  return (
    <AnimatePresence mode="wait">
      <motion.ul
        key={flavor.id + "-layers"}
        initial={{ opacity: 0, x: align === "left" ? -10 : 0, y: align === "center" ? 10 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={
          compact
            ? "flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            : "flex flex-col gap-3"
        }
      >
        {top.map((layer) => (
          <li key={layer} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground/70">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/20"
              style={{ backgroundColor: LAYER_COLORS[layer] ?? "#888" }}
            />
            {LAYER_LABEL[layer] ?? layer}
          </li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
}

function FlavorCard({
  flavor,
  active,
  onClick,
}: {
  flavor: Flavor;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{
        scale: active ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex flex-col items-start gap-2 overflow-hidden rounded-2xl border p-3 text-left backdrop-blur-md transition-colors md:p-4"
      style={{
        borderColor: active ? flavor.accent : "rgba(255,255,255,0.12)",
        backgroundColor: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        boxShadow: active ? `0 14px 40px -14px ${flavor.glow}` : "none",
      }}
    >
      {/* Mini layer bar */}
      <div className="flex h-10 w-full overflow-hidden rounded-md ring-1 ring-white/10 md:h-12">
        {[...flavor.layers].reverse().map((layer) => (
          <div
            key={layer}
            className="flex-1"
            style={{ backgroundColor: LAYER_COLORS[layer] ?? "#888" }}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.2em] md:text-xs"
          style={{ color: active ? flavor.accent : "rgba(255,255,255,0.85)" }}
        >
          {flavor.name}
        </span>
        <span className="text-[10px] text-foreground/50">{flavor.price}</span>
      </div>
      {active && (
        <motion.span
          layoutId="active-dot"
          className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: flavor.accent, boxShadow: `0 0 12px ${flavor.glow}` }}
        />
      )}
    </motion.button>
  );
}
