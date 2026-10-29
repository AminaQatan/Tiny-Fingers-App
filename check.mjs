import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({});
for(const file of ['data.js','themes-art.js','themes.js','scenes.js'])vm.runInContext(fs.readFileSync(''+file,'utf8'),context,{filename:file});
vm.runInContext('globalThis.content={WORLDS,GLYPHS,WORDS,ART,WORLD_GROUPS,extendedBackground,SCENES};',context);
const {WORLDS,GLYPHS,WORDS,ART,WORLD_GROUPS,extendedBackground,SCENES}=context.content;
assert.equal(Object.keys(GLYPHS).length,62);
for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')assert(GLYPHS[c]?.length,`Missing tracing guide for ${c}`);
assert.equal(WORLDS.length,20);
assert.equal(new Set(WORLDS.map(w=>w.id)).size,20);
assert.equal(WORLDS.slice(0,6).map(w=>w.id).join(','),'farm,ocean,park,space,kitchen,classroom','Existing progress IDs and lesson order must remain stable');
assert.equal(WORLDS.filter(w=>w.group==='home').length,7);
for(const w of WORLDS){
 assert(WORLD_GROUPS.some(g=>g.id===w.group));
 const scene=SCENES[w.id];assert(scene?.description,`${w.id}: missing complete scene`);
 assert.equal(scene.objects.length,6);assert.equal(new Set(scene.objects.map(o=>o[0])).size,6);
 for(const [id,x,y,width,height] of scene.objects){assert(w.items.some(i=>i.id===id),`${w.id}: scene object ${id} has no word card`);assert(x>=0&&y>=0&&width>0&&height>0&&x+width<=720.01&&y+height<=440.01,`${w.id}: ${id} outside complete scene`);}
 if(w.id!=='shapes')assert(fs.existsSync(`${w.id}.png`),`${w.id}: missing picture cards`);
 assert.equal(w.items.length,6);assert.equal(w.questions.length,6);
 assert.equal(new Set(w.items.map(i=>i.id)).size,6);
 for(const i of w.items){assert(ART[i.id],`${w.id}: missing ${i.id} illustration`);assert(i.name&&i.sentence);assert(i.x>=0&&i.y>=0&&i.x+i.w<=720&&i.y+i.h<=390,`${w.id}: ${i.name} outside picture`);assert(WORDS.includes(i.name),`${i.name} unavailable for tracing`);}
 assert.equal(w.questions.map(q=>q.type).join(','),'Who,What,Where,When,Why,How');
 for(const q of w.questions){assert.equal(q.choices.length,3);assert.equal(new Set(q.choices.map(c=>c.label)).size,3);assert(q.choices[q.correct]);assert(q.explain);}
 if(WORLDS.indexOf(w)>=6)assert(extendedBackground(w),`${w.id} needs its own background`);
}
assert.equal(new Set(WORDS).size,WORDS.length);
for(const word of [...WORDS,...WORLDS.map(w=>w.word)]){assert(word.length<=18,`Word exceeds custom input limit: ${word}`);for(const c of word.replaceAll(' ',''))assert(GLYPHS[c],`Unsupported tracing character ${c}`)}
new vm.Script(fs.readFileSync('app.js','utf8'));
const html=fs.readFileSync('index.html','utf8');
for(const asset of ['style.css','icon.svg','friendly.ttf','data.js','themes-art.js','themes.js','scenes.js','app.js'])assert(fs.existsSync(''+asset));
for(const script of ['data.js','themes-art.js','themes.js','scenes.js','app.js'])assert(html.includes(`src="${script}`));
console.log(`Passed: 20 themes, 120 talking picture items, 120 WH questions, ${WORDS.length} tracing words, 62 character guides, all theme assignments, original progress IDs, backgrounds, 20 complete scenes with matching objects, and assets.`);
