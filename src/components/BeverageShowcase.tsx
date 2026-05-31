import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { FLAVORS, type Flavor } from "@/data/flavors";
import ingMatcha from "@/assets/ing-matcha.png";
import ingStrawberry from "@/assets/ing-strawberry.png";
import ingBlueberry from "@/assets/ing-blueberry.png";
import ingMango from "@/assets/ing-mango.png";

const INGREDIENT: Record<string, string> = {
  "matcha-latte": ingMatcha,
  "strawberry-matcha": ingStrawberry,
  "blueberry-matcha": ingBlueberry,
  "mango-matcha": ingMango,
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function BeverageShowcase() {
  const [index, setIndex] = useState(0);
  const count = FLAVORS.length;
  const current = FLAVORS[index];

  const select = (i: number) => setIndex(mod(i, count));

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

  // ───── 3D parallax — track pointer/touch as a -1..1 vector ─────
  const stageRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0); // -1..1
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 80, damping: 18, mass: 0.6 });
  const spy = useSpring(py, { stiffness: 80, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      const nx = ((cx - r.left) / r.width) * 2 - 1;
      const ny = ((cy - r.top) / r.height) * 2 - 1;
      px.set(Math.max(-1, Math.min(1, nx)));
      py.set(Math.max(-1, Math.min(1, ny)));
    };
    const onMove = (e: PointerEvent) => update(e.clientX, e.clientY);
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py]);

  // Layered parallax outputs — different depths move different amounts
  const bgX = useTransform(spx, [-1, 1], [12, -12]);
  const bgY = useTransform(spy, [-1, 1], [10, -10]);
  const haloX = useTransform(spx, [-1, 1], [-18, 18]);
  const haloY = useTransform(spy, [-1, 1], [-14, 14]);
  const cupX = useTransform(spx, [-1, 1], [-26, 26]);
  const cupY = useTransform(spy, [-1, 1], [-20, 20]);
  const cupRotY = useTransform(spx, [-1, 1], [8, -8]);
  const cupRotX = useTransform(spy, [-1, 1], [-6, 6]);
  const orbitRotY = useTransform(spx, [-1, 1], [12, -12]);
  const orbitRotX = useTransform(spy, [-1, 1], [-8, 8]);
  const textX = useTransform(spx, [-1, 1], [-8, 8]);


  return (
    <div
      ref={stageRef}
      className="relative min-h-screen w-full overflow-hidden bg-background"
      style={{ perspective: 1400 }}
    >
      {/* Atmospheric background (deepest layer, drifts slowest) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% 40%, ${current.bgTo} 0%, ${current.bgFrom} 55%, #07140d 100%)`,
            x: bgX,
            y: bgY,
            scale: 1.06,
          }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
        <div className="font-display text-lg tracking-[0.3em] text-foreground/90 md:text-xl">
          MATCHA<span className="opacity-50"> · </span>STATION
        </div>
        <button className="rounded-full border border-foreground/20 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.25em] text-foreground/80 transition hover:bg-foreground/10">
          Bag · 0
        </button>
      </header>

      {/* Swipe surface — full main stage */}
      <motion.main
        className="relative z-10 flex h-[calc(100vh-72px)] w-full touch-pan-y select-none flex-col items-center justify-center"
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        style={{ touchAction: "pan-y", transformStyle: "preserve-3d" }}
      >
        {/* Stage center */}
        <motion.div
          className="relative flex h-[58vh] w-full max-w-2xl items-center justify-center md:h-[62vh]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Orbiting flavor cards (mid layer) */}
          <motion.div
            className="absolute inset-0"
            style={{
              rotateY: orbitRotY,
              rotateX: orbitRotX,
              transformStyle: "preserve-3d",
            }}
          >
            <FlavorOrbit
              activeIndex={index}
              count={count}
              onSelect={select}
              parallaxX={spx}
              parallaxY={spy}
            />
          </motion.div>

          {/* Center cup (top layer, biggest parallax) */}
          <motion.div
            className="relative z-20 pointer-events-none"
            style={{
              x: cupX,
              y: cupY,
              rotateY: cupRotY,
              rotateX: cupRotX,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Glow halo — drifts opposite for depth */}
            <motion.div
              key={current.id + "-glow"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 top-1/2 -z-10 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${current.glow} 0%, transparent 65%)`,
                filter: "blur(30px)",
                x: haloX,
                y: haloY,
              }}
            />
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id + "-img"}
                src={current.image}
                alt={current.name}
                draggable={false}
                initial={{ y: 24, opacity: 0, scale: 0.94 }}
                animate={{
                  y: [0, -10, 0],
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ y: -18, opacity: 0, scale: 0.96 }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.45 },
                  scale: { duration: 0.45 },
                }}
                className="drag-none h-[46vh] max-h-[520px] w-auto object-contain md:h-[58vh]"
                style={{
                  filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 28px ${current.glow})`,
                }}
              />
            </AnimatePresence>
            {/* Floor reflection */}
            <div
              className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto h-10 w-[65%] rounded-[50%]"
              style={{
                background: `radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)`,
                filter: "blur(10px)",
              }}
            />
          </motion.div>
        </motion.div>


        {/* Name + description (subtle parallax, opposite direction) */}
        <motion.div
          className="relative z-20 mt-2 flex flex-col items-center px-6 text-center md:mt-4"
          style={{ x: textX }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-name"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                Choose your matcha
              </span>
              <h1 className="font-display text-4xl tracking-tight text-foreground md:text-6xl">
                {current.name}
              </h1>
              <p className="mt-2 max-w-md text-balance text-xs leading-relaxed text-foreground/65 md:text-sm">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-4">
            <span className="font-display text-xl text-foreground md:text-2xl">
              {current.price}
            </span>
            <button
              className="rounded-full px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.25em] text-background transition hover:scale-[1.03]"
              style={{
                backgroundColor: current.accent,
                boxShadow: `0 10px 40px -10px ${current.glow}`,
              }}
            >
              Add to Order
            </button>
          </div>
        </motion.div>


        {/* Hint */}
        <div className="pointer-events-none mt-3 text-[10px] uppercase tracking-[0.4em] text-foreground/30">
          ← swipe · tap a card →
        </div>
      </motion.main>
    </div>
  );
}

/* ----------------------------- Orbit of cards ----------------------------- */

function FlavorOrbit({
  activeIndex,
  count,
  onSelect,
}: {
  activeIndex: number;
  count: number;
  onSelect: (i: number) => void;
}) {
  // Responsive radius
  const [dims, setDims] = useState({ radiusX: 200, radiusY: 60, step: 32 });
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 480) setDims({ radiusX: 135, radiusY: 30, step: 28 });
      else if (w < 768) setDims({ radiusX: 200, radiusY: 50, step: 30 });
      else setDims({ radiusX: 280, radiusY: 70, step: 32 });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      {FLAVORS.map((f, i) => {
        // shortest signed offset from active
        let off = i - activeIndex;
        off = ((off + count / 2) % count + count) % count - count / 2;

        const angle = off * dims.step; // degrees
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * dims.radiusX;
        const y = -Math.cos(rad) * dims.radiusY; // arc above cup base
        const isActive = off === 0;

        return (
          <OrbitCard
            key={f.id}
            flavor={f}
            x={x}
            y={y}
            angle={angle}
            isActive={isActive}
            depth={Math.abs(off)}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  );
}

function OrbitCard({
  flavor,
  x,
  y,
  angle,
  isActive,
  depth,
  onClick,
}: {
  flavor: Flavor;
  x: number;
  y: number;
  angle: number;
  isActive: boolean;
  depth: number;
  onClick: () => void;
}) {
  const ingredient = INGREDIENT[flavor.id];
  return (
    <motion.button
      onClick={onClick}
      type="button"
      initial={false}
      animate={{
        x,
        y,
        rotate: angle * 0.55,
        scale: isActive ? 1.1 : 1 - depth * 0.06,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.7 }}
      whileTap={{ scale: isActive ? 1.08 : 0.95 }}
      className="absolute flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border backdrop-blur-md md:h-[110px] md:w-[110px]"
      style={{
        left: "50%",
        top: "50%",
        zIndex: 10 - depth,
        borderColor: isActive ? flavor.accent : "rgba(255,255,255,0.18)",
        background: isActive
          ? `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))`
          : "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
        boxShadow: isActive
          ? `0 18px 50px -15px ${flavor.glow}, 0 0 0 2px ${flavor.accent}30`
          : "0 10px 30px -15px rgba(0,0,0,0.6)",
      }}
      aria-label={flavor.name}
    >
      <img
        src={ingredient}
        alt={flavor.name}
        draggable={false}
        className="drag-none h-[70%] w-[70%] object-contain"
        style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}
      />
      {isActive && (
        <motion.span
          layoutId="orbit-active-dot"
          className="absolute -bottom-1.5 h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: flavor.accent,
            boxShadow: `0 0 10px ${flavor.glow}`,
          }}
        />
      )}
    </motion.button>
  );
}
