// Run with Node.js and sharp installed. Preserve the existing logo; no generative edits.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  const source = path.join(root, 'assets/logo-gold.png');
  const {data, info} = await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width, top=info.height, right=0, bottom=0;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const i=(y*info.width+x)*4;
    if(data[i+3]>32 && data[i]>80 && data[i]>data[i+2]*1.15) {
      left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
    }
  }
  const crop={left,top,width:right-left+1,height:bottom-top+1};
  const pngs=[];
  for(const size of [16,32,48,96,180]) {
    const padding=Math.max(2,Math.round(size*.08));
    const logo=await sharp(source).extract(crop).resize(size-padding*2,size-padding*2,{fit:'contain',background:'#082331'}).flatten({background:'#082331'}).png().toBuffer();
    const png=await sharp({create:{width:size,height:size,channels:3,background:'#082331'}}).composite([{input:logo,left:padding,top:padding}]).png().toBuffer();
    await fs.writeFile(path.join(root,'assets',size===180?'apple-touch-icon.png':`favicon-${size}.png`),png);
    if(size<=48)pngs.push({size,png});
  }
  // ICO directory with PNG entries, supported by current browsers.
  const header=Buffer.alloc(6+16*pngs.length);header.writeUInt16LE(1,2);header.writeUInt16LE(pngs.length,4);
  let offset=header.length;
  pngs.forEach(({size,png},i)=>{const pos=6+i*16;header[pos]=size;header[pos+1]=size;header.writeUInt16LE(1,pos+4);header.writeUInt16LE(32,pos+6);header.writeUInt32LE(png.length,pos+8);header.writeUInt32LE(offset,pos+12);offset+=png.length;});
  await fs.writeFile(path.join(root,'favicon.ico'),Buffer.concat([header,...pngs.map(x=>x.png)]));
  console.log('Generated full-logo favicons:',crop);
})().catch(error=>{console.error(error);process.exitCode=1;});
