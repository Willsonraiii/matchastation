import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  useSpring,
  type PanInfo,
} from "framer-motion";
import { FLAVORS, type Flavor } from "@/data/flavors";

const _unused: Flavor[] = [
  {
    id: "matcha",
    name: "Matcha",
    jp: "抹茶",
    tagline: "Stone-ground ceremonial",
    description:
      "Single-origin Uji leaves, stone-milled at dawn. A vegetal hush of umami, finished with cold oat cream.",
    price: "¥820",
    image: matchaImg,
    glow: "rgba(120, 200, 110, 0.55)",
    bgFrom: "#0d2418",
    bgTo: "#1f4a2c",
    accent: "#9ee8a4",
  },
  {
    id: "yuzu",
    name: "Yuzu",
    jp: "柚子",
    tagline: "Sun-kissed citrus",
    description:
      "Hand-zested Kōchi yuzu, sparkling spring water, a whisper of honey. Bright, electric, alive.",
    price: "¥780",
    image: yuzuImg,
    glow: "rgba(255, 210, 90, 0.55)",
    bgFrom: "#2a2410",
    bgTo: "#5a4a18",
    accent: "#ffe080",
  },
  {
    id: "sakura",
    name: "Sakura",
    jp: "桜",
    tagline: "Blossom infusion",
    description:
      "Salt-cured Yoshino petals steeped in spring milk. Floral, faintly almond, undeniably spring.",
    price: "¥860",
    image: sakuraImg,
    glow: "rgba(255, 170, 200, 0.55)",
    bgFrom: "#2a1620",
    bgTo: "#5a2840",
    accent: "#ffc0d6",
  },
  {
    id: "hojicha",
    name: "Hojicha",
    jp: "焙じ茶",
    tagline: "Roasted amber",
    description:
      "Charcoal-roasted Kyoto leaves. Toasted hazelnut, caramelized sugar, the warmth of a kettle at dusk.",
    price: "¥740",
    image: hojichaImg,
    glow: "rgba(230, 140, 70, 0.55)",
    bgFrom: "#2a1a10",
    bgTo: "#5a2e16",
    accent: "#ffba80",
  },
  {
    id: "ube",
    name: "Ube",
    jp: "紫芋",
    tagline: "Velvet root",
    description:
      "Purple yam slow-steamed with coconut cream. Earthy, silken, with a quiet vanilla finish.",
    price: "¥880",
    image: ubeImg,
    glow: "rgba(180, 120, 255, 0.55)",
    bgFrom: "#1c1030",
    bgTo: "#3a1c5c",
    accent: "#d8b4ff",
  },
];

const STEP = 220; // px per flavor step
const ORBIT_RADIUS = 260;

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function BeverageShowcase() {
  const count = FLAVORS.length;
  const drag = useMotionValue(0);
  const smooth = useSpring(drag, { stiffness: 120, damping: 22, mass: 0.6 });
  const [index, setIndex] = useState(0);
  const dragStart = useRef(0);

  // index derived from smooth offset
  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      const i = mod(Math.round(-v / STEP), count);
      setIndex(i);
    });
    return unsub;
  }, [smooth, count]);

  const snapTo = (i: number) => {
    const current = drag.get();
    const currentIdx = -current / STEP;
    const delta = i - currentIdx;
    // shortest path
    const wrapped = ((delta + count / 2) % count + count) % count - count / 2;
    animate(drag, current - wrapped * STEP, {
      type: "spring",
      stiffness: 140,
      damping: 22,
    });
  };

  const onDragStart = () => {
    dragStart.current = drag.get();
  };
  const onDrag = (_: unknown, info: PanInfo) => {
    drag.set(dragStart.current + info.offset.x);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = drag.get() + info.velocity.x * 0.25;
    const target = Math.round(-projected / STEP);
    animate(drag, -target * STEP, {
      type: "spring",
      stiffness: 140,
      damping: 22,
      velocity: info.velocity.x,
    });
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") snapTo(index + 1);
      if (e.key === "ArrowLeft") snapTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const current = FLAVORS[index];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Animated atmospheric background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% 40%, ${current.bgTo} 0%, ${current.bgFrom} 55%, #07140d 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Soft noise / vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.55)_100%)]" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <div className="font-display text-2xl tracking-wide text-foreground/90 md:text-3xl">
          AKARI<span className="opacity-50">.</span>
        </div>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.25em] text-foreground/60 md:flex">
          <a className="hover:text-foreground" href="#">Shop</a>
          <a className="hover:text-foreground" href="#">Ritual</a>
          <a className="hover:text-foreground" href="#">Journal</a>
        </nav>
        <button className="rounded-full border border-foreground/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-foreground/80 transition hover:bg-foreground/10">
          Bag · 0
        </button>
      </header>

      {/* Giant kanji watermark */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + "-kanji"}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.06, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[40vw] leading-none text-foreground md:text-[28vw]"
        >
          {current.jp}
        </motion.div>
      </AnimatePresence>

      {/* Main stage */}
      <main
        className="relative z-10 flex h-full flex-col items-center justify-center"
        style={{ touchAction: "pan-y" }}
      >
        {/* Flavor name */}
        <div className="absolute top-[14%] z-20 flex flex-col items-center md:top-[16%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-name"}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                {current.tagline}
              </span>
              <h1 className="font-display text-6xl tracking-tight text-foreground md:text-8xl">
                {current.name}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cup carousel */}
        <motion.div
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          <div className="relative h-full w-full">
            {FLAVORS.map((f, i) => (
              <CupItem
                key={f.id}
                flavor={f}
                i={i}
                count={count}
                drag={smooth}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 md:px-12 md:pb-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id + "-desc"}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md text-balance text-center text-sm leading-relaxed text-foreground/70 md:text-left"
              >
                {current.description}
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + "-price"}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-3xl text-foreground md:text-4xl"
                >
                  {current.price}
                </motion.div>
              </AnimatePresence>
              <button
                className="rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] text-background transition hover:scale-[1.03]"
                style={{
                  backgroundColor: current.accent,
                  boxShadow: `0 10px 40px -10px ${current.glow}`,
                }}
              >
                Add to Ritual
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {FLAVORS.map((f, i) => (
              <button
                key={f.id}
                onClick={() => snapTo(i)}
                className="group relative h-2 w-2"
                aria-label={f.name}
              >
                <span
                  className="absolute inset-0 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      i === index ? current.accent : "rgba(255,255,255,0.25)",
                    transform: i === index ? "scale(1.6)" : "scale(1)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-32 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/30 md:bottom-40">
        ← drag to explore →
      </div>
    </div>
  );
}

function CupItem({
  flavor,
  i,
  count,
  drag,
}: {
  flavor: Flavor;
  i: number;
  count: number;
  drag: ReturnType<typeof useMotionValue<number>>;
}) {
  // Relative position in steps with wrap-around (shortest path)
  const rel = useTransform(drag, (v) => {
    const center = -v / STEP;
    let r = i - center;
    r = ((r + count / 2) % count + count) % count - count / 2;
    return r;
  });

  const x = useTransform(rel, (r) => r * ORBIT_RADIUS);
  const scale = useTransform(rel, (r) => {
    const a = Math.abs(r);
    return Math.max(0.35, 1 - a * 0.28);
  });
  const opacity = useTransform(rel, (r) => {
    const a = Math.abs(r);
    if (a > 2.2) return 0;
    return Math.max(0, 1 - a * 0.38);
  });
  const rotateY = useTransform(rel, (r) => r * -18);
  const z = useTransform(rel, (r) => -Math.abs(r) * 100);
  const blur = useTransform(rel, (r) => `blur(${Math.min(Math.abs(r) * 2.5, 8)}px)`);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{
        x,
        scale,
        opacity,
        rotateY,
        z,
        filter: blur,
        translateX: "-50%",
        translateY: "-50%",
        transformPerspective: 1200,
      }}
    >
      {/* Floating loop */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Glow halo */}
        <div
          className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${flavor.glow} 0%, transparent 65%)`,
            filter: "blur(20px)",
          }}
        />
        <img
          src={flavor.image}
          alt={flavor.name}
          width={384}
          height={512}
          draggable={false}
          className="drag-none h-[55vh] max-h-[560px] w-auto select-none object-contain"
          style={{
            filter: `drop-shadow(0 40px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 30px ${flavor.glow})`,
          }}
        />
        {/* Floor reflection */}
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-2 mx-auto h-12 w-[60%] rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
