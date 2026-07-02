import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const orange = "#f26b1d";
  const darkGreen = "#1a3c2e";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f4ef",
          borderRadius: 6,
          display: "flex",
          flexWrap: "wrap",
          padding: 1,
          gap: 2
        }}
      >
        <div style={{ background: orange, width: 14, height: 14, borderRadius: 2 }} />
        <div style={{ background: darkGreen, width: 14, height: 14, borderRadius: 2 }} />
        <div style={{ background: darkGreen, width: 14, height: 14, borderRadius: 2 }} />
        <div style={{ background: orange, width: 14, height: 14, borderRadius: 2 }} />
      </div>
    ),
    { ...size }
  );
}
