const sharp = require("sharp");

const IN = "public/brand/hazenco-brain.png";
const OUT = "src/app/icon.png";
const SIZE = 512;
const PAD = 56;

(async () => {
  const inner = SIZE - PAD * 2;
  const logo = await sharp(IN)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 26, g: 60, b: 46, alpha: 1 }
    }
  })
    .composite([{ input: logo, top: PAD, left: PAD }])
    .png()
    .toFile(OUT);
  console.log("Wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
