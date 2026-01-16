import type { Metadata } from "next";

export const SITE_NAME = "Exp";
export const SITE_TITLE = "Exp — Finances, Oversimplified";
export const SITE_DESCRIPTION =
  "A simple personal finance tracker that makes money management oversimplified: track expenses, see monthly totals, and ask the finance assistant.";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const OG_IMAGE_ALT = "Exp — Finances, Oversimplified";

export function createMetadata(params: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const title = params.title ? `${params.title} · ${SITE_NAME}` : SITE_TITLE;
  const description = params.description ?? SITE_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: SITE_URL,
    alternates: params.path
      ? {
          canonical: params.path,
        }
      : undefined,
    applicationName: SITE_NAME,
    keywords: [
      "personal finance",
      "budget tracker",
      "expense tracker",
      "money management",
      "finances",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: params.path,
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image.jpg"],
    },
  } satisfies Metadata;
}
