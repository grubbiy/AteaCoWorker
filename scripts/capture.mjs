// Capture actual UI states for the repository's animated preview.
// Run against the local server; this does not use generated imagery.
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE,args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
const base=process.env.DEMO_URL||'http://127.0.0.1:4173/AteaCoWorker/';
await mkdir('artifacts/animation',{recursive:true});
await mkdir('docs/images',{recursive:true});
await page.goto(base,{waitUntil:'networkidle'});
await page.screenshot({path:'docs/images/website.png'});
const tab=name=>page.locator(`[data-tab="${name}"]`).click();
async function capture(name){await page.mouse.move(0,0);await page.locator('.app-shell').screenshot({path:`artifacts/animation/${name}.png`});}
await tab('sources');await capture('01-sources');
await page.locator('[data-action="prepare"]').click();
await page.locator('[data-action="confirm-prepare"]').click();
await page.waitForFunction(()=>document.querySelector('#pack-strip').textContent.includes('ready with gaps'));
await page.locator('#offline-toggle').click();
await tab('assistant');await page.locator('[data-question="Help me prepare for the workshop"]').click();await capture('02-answer');
await tab('document');await page.locator('[data-action="create-document"]').click();await capture('03-document');
await tab('slides');await page.locator('[data-action="outline"]').click();await page.locator('[data-action="create-slides"]').click();await capture('04-slides');
await tab('settings');await capture('05-settings');
await browser.close();
