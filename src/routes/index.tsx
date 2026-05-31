import { createFileRoute } from "@tanstack/react-router";
import BeverageShowcase from "@/components/BeverageShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matcha Station — Iced Matcha Flavor Bar" },
      {
        name: "description",
        content:
          "Pick your matcha: Matcha Latte, Strawberry, Blueberry, or Mango. An interactive iced matcha flavor selector.",
      },
      { property: "og:title", content: "Matcha Station — Iced Matcha Flavor Bar" },
      {
        property: "og:description",
        content: "Tap a flavor to switch your iced matcha — strawberry, blueberry, mango, or classic.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <BeverageShowcase />;
}
