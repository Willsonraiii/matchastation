import matchaImg from "@/assets/cup-matcha.png";
import yuzuImg from "@/assets/cup-yuzu.png";
import sakuraImg from "@/assets/cup-sakura.png";
import hojichaImg from "@/assets/cup-hojicha.png";
import ubeImg from "@/assets/cup-ube.png";
import flavorsJson from "./flavors.json";

export type Flavor = {
  id: string;
  name: string;
  jp: string;
  tagline: string;
  description: string;
  price: string;
  image: string; // resolved URL
  glow: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
};

// Map JSON `image` keys to bundled assets. Add new entries here when adding new cup images.
const IMAGES: Record<string, string> = {
  matcha: matchaImg,
  yuzu: yuzuImg,
  sakura: sakuraImg,
  hojicha: hojichaImg,
  ube: ubeImg,
};

export const FLAVORS: Flavor[] = (flavorsJson as Array<Omit<Flavor, "image"> & { image: string }>).map(
  (f) => ({
    ...f,
    image: IMAGES[f.image] ?? f.image,
  }),
);
