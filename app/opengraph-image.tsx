import { ImageResponse } from "next/og";

import { OG_IMAGE_ALT, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #0b1220 0%, #111827 55%, #0b1220 100%)",
          color: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.17)",
              }}
            />
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>
              Exp
            </div>
          </div>

          <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -1.5 }}>
            {SITE_TITLE.replace("Exp — ", "")}
          </div>

          <div
            style={{
              fontSize: 28,
              opacity: 0.9,
              lineHeight: 1.25,
              maxWidth: 980,
            }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}>
          <div style={{ fontSize: 22, opacity: 0.85 }}>Track • Analyze • Simplify</div>
          <div style={{ fontSize: 18, opacity: 0.7 }}>{OG_IMAGE_ALT}</div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
