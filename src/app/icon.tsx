import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const peach = "#f59e7c";
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
          padding: 2,
          gap: 2
        }}
      >
        <div style={{ background: peach, width: 13, height: 13, borderRadius: 1.5 }} />
        <div style={{ background: darkGreen, width: 13, height: 13, borderRadius: 1.5 }} />
        <div style={{ background: darkGreen, width: 13, height: 13, borderRadius: 1.5 }} />
        <div style={{ background: peach, width: 13, height: 13, borderRadius: 1.5 }} />
      </div>
    ),
    { ...size }
  );
}
