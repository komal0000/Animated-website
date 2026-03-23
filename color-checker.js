import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/public/frames/frame_0045.webp');
  
  const result = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.width = img.width; 
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Sample a few pixels to find the predominant non-black color
    const samples = [];
    for(let i=0; i<10; i++) {
        for(let j=0; j<10; j++) {
            const row = Math.floor(img.height * (i/10));
            const col = Math.floor(img.width * (j/10));
            const data = ctx.getImageData(col, row, 1, 1).data;
            if(data[0] > 10 || data[1] > 10 || data[2] > 10) {
               samples.push(`rgb(${data[0]},${data[1]},${data[2]})`);
            }
        }
    }
    return samples;
  });
  
  console.log('COLORS FOUND:', result);
  await browser.close();
})();
