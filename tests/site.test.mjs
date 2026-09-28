import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const html=await readFile(new URL('../site/index.html',import.meta.url),'utf8');
test('asset URLs are relative and exist under GitHub Pages prefix',async()=>{for(const [,path] of html.matchAll(/(?:src|href)="([^"#]+\.(?:css|js|svg))"/g)){assert.ok(!path.startsWith('/'));assert.ok(!path.startsWith('http'));await access(new URL('../site/'+path,import.meta.url));}});
test('all navigation anchors resolve',()=>{for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),id);});
test('static cache covers the complete interactive app',async()=>{const sw=await readFile(new URL('../site/sw.js',import.meta.url),'utf8');for(const asset of ['index.html','style.css','app.js','model.js','favicon.svg'])assert.ok(sw.includes(`./${asset}`),asset);});
test('no external fonts, scripts, forms, or application APIs',async()=>{assert.doesNotMatch(html,/<(?:script|link)[^>]*(?:src|href)="https?:/i);const css=await readFile(new URL('../site/style.css',import.meta.url),'utf8');assert.doesNotMatch(css,/@import|url\(\s*['"]?https?:/i);const js=await readFile(new URL('../site/app.js',import.meta.url),'utf8');assert.doesNotMatch(js,/\b(?:eval|fetch|WebSocket)\s*\(/);assert.ok(html.includes("form-action 'none'"));});
