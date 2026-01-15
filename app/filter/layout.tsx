import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Filter Transactions",
  path: "/filter",
});

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
