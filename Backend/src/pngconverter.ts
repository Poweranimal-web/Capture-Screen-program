import sharp from 'sharp';

function convertBGRAtoRGBA(bgra: Buffer): Buffer {
    const rgba = Buffer.alloc(bgra.length);
    for (let i = 0; i < bgra.length; i += 4) {
      rgba[i]     = bgra[i + 2]; // R
      rgba[i + 1] = bgra[i + 1]; // G
      rgba[i + 2] = bgra[i];     // B
      rgba[i + 3] = bgra[i + 3]; // A
    }
    return rgba;
}
export default async function saveToPNG(buffer: Buffer, width: number, height: number, outPath: string) {
    let rgba : Buffer = convertBGRAtoRGBA(buffer); 
    await sharp(rgba, {
    raw: { width, height, channels: 4 },
  }).png().toFile(outPath);
}