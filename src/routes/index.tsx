import { createFileRoute } from "@tanstack/react-router";
import BeverageShowcase from "@/components/BeverageShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akari — Premium Japanese Beverages" },
      {
        name: "description",
        content:
          "An interactive showcase of Akari's ceremonial Japanese drinks — matcha, yuzu, sakura, hojicha, ube.",
      },
      { property: "og:title", content: "Akari — Premium Japanese Beverages" },
      {
        property: "og:description",
        content: "Interactive product experience for Akari's craft drinks.",
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
