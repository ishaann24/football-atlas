import sharp from 'sharp';
import { mkdirSync } from 'fs';
mkdirSync('public/images', { recursive: true });
const src = 'public/images/trophy-sheet.png';
const meta = await sharp(src).metadata();
const W = Math.floor(meta.width / 5);
const H = Math.floor(meta.height / 2);
const frames = [
  [0,0,'front'],[1,0,'front-right'],[2,0,'right'],
  [3,0,'back-right'],[4,0,'back'],
  [0,1,'back-left'],[1,1,'left'],[2,1,'front-left'],
  [3,1,'top'],[4,1,'bottom']
];
for (const [col, row, name] of frames) {
  await sharp(src)
    .extract({ left: col*W, top: row*H, width: W, height: H })
    .png()
    .toFile(`public/images/trophy-${name}.png`);
  console.log(`✓ trophy-${name}.png`);
}
console.log('All frames extracted!');
