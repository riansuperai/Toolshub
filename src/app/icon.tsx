import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f59e7c 0%, #ef7e57 100%)",
          color: "white",
          fontFamily: "serif",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
