import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon voor Chrome-tab (16-32px). Op deze pixel-budget werkt
 * 'hoog contrast + één sterke shape' beter dan de 4-blokken van de
 * header-mark. Dark green vierkant met bolde cream 'H' — leest van
 * 16px, matcht header-branding, staat helder tegen zowel light- als
 * dark-mode browser chrome.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1a3c2e",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f7f4ef",
          fontFamily: "serif",
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}
