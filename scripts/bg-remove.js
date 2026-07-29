const sharp = require("sharp");

const IN = "public/brand/Brain Logo.png";
const OUT = "public/brand/hazenco-hub.png";

(async () => {
  const img = sharp(IN).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const minC = Math.min(r, g, b);
    if (r >= 235 && g >= 235 && b >= 235) {
      data[i + 3] = 0;
    } else if (minC >= 200) {
      const t = (minC - 200) / 35;
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 })
    .toFile(OUT);
  console.log("Wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
