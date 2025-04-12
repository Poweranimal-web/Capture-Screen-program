import sharp from 'sharp';
export default async function saveToJPEGBuffer(buffer: Buffer, width: number, height: number) : Promise<Buffer> {
  return sharp(buffer, {
    raw: { width, height, channels: 4 },
  }).resize(960).jpeg({ quality: 25, }).toBuffer();
  
}