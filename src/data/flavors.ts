import matchaImg from "@/assets/glass-matcha.png";
import strawberryImg from "@/assets/glass-strawberry.png";
import blueberryImg from "@/assets/glass-blueberry.png";
import mangoImg from "@/assets/glass-mango.png";
import flavorsJson from "./flavors.json";

export type Flavor = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
  layers: string[];
  glow: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
};

const IMAGES: Record<string, string> = {
  matcha: matchaImg,
  strawberry: strawberryImg,
  blueberry: blueberryImg,
  mango: mangoImg,
};

export const FLAVORS: Flavor[] = (
  flavorsJson as Array<Omit<Flavor, "image"> & { image: string }>
).map((f) => ({ ...f, image: IMAGES[f.image] ?? f.image }));
