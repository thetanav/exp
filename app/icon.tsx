import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1220 0%, #111827 55%, #0b1220 100%)",
          color: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}>
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: 96,
            border: "2px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: -6,
          }}>
          E
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
