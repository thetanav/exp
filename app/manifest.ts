import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Exp — Finances, Oversimplified",
    short_name: "Exp",
    description:
      "A simple personal finance tracker that makes money management oversimplified.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
  };
}
