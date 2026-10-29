import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const dom={textContent:'',focus(){},classList:{add(){},remove(){},toggle(){}},style:{setProperty(){}}};
const context=vm.createContext({console,setTimeout,clearTimeout,matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null,setItem(){}},document:{addEventListener(){},querySelector:()=>dom,querySelectorAll:()=>[]},window:{},assert});
for(const file of ['data.js','themes-art.js','themes.js','scenes.js','detective.js'])vm.runInContext(fs.readFileSync(''+file,'utf8'),context,{filename:file});
const core=fs.readFileSync('app.js','utf8').split("$$('[data-icon]')")[0];
vm.runInContext(core,context);
vm.runInContext(`
save=()=>{};celebrate=()=>{};chime=()=>{};toast=()=>{};speak=()=>{};renderDetective=()=>{};
// Every theme exposes six matching scene and word targets.
for(let n=0;n<WORLDS.length;n++)for(const kind of ['pictures','words']){
 worldIndex=n;detectiveKind=kind;const m=detectiveMission();assert.equal(m.items.length,6);assert.equal(new Set(m.items.map(i=>i.id)).size,6);
 assert(m.items.every(it=>WORLDS[n].items.some(x=>x.id===it.id)));assert(detectivePrompt(m).length>0);
}
for(const letterType of ['upper','lower']){
 const found=new Set();detectiveKind='letters';detectiveCase=letterType;
 for(let p=0;p<5;p++){detectivePage=p;const m=detectiveMission();assert.equal(new Set(m.items.map(i=>i.id)).size,6);m.items.forEach(i=>found.add(i.id))}
 assert.equal(found.size,26);
}
detectiveKind='numbers';const numbers=new Set();for(let p=0;p<17;p++){detectivePage=p;const m=detectiveMission();assert.equal(new Set(m.items.map(i=>i.id)).size,6);m.items.forEach(i=>numbers.add(i.id))}assert.equal(numbers.size,101);
// Incorrect choices, repeated taps and replay cannot inflate progress.
worldIndex=WORLDS.findIndex(w=>w.id==='bedroom');detectiveKind='pictures';progress.detective={};progress.seen={};progress.earned=[];detectivePending=false;
const m=detectiveMission();chooseDetective(m.items[1].id);assert.equal(m.state.found.length,0);assert.equal(progress.earned.length,0);
chooseDetective(m.items[0].id);assert.equal(m.state.found.length,1);assert.equal(progress.earned.length,1);assert.equal(progress.seen.bedroom.length,1);
chooseDetective(m.items[0].id);assert.equal(progress.earned.length,1);
chooseDetective(m.items[1].id);assert.equal(m.state.found.length,1,'Wait for Next clue before another target');
for(const it of m.items.slice(1)){detectivePending=false;chooseDetective(it.id)}assert.equal(progress.earned.length,6);assert.equal(m.state.found.length,6);assert.equal(detectiveTarget(m),undefined);assert.equal(collectionItems().length,6);
m.state.hintUsed=true;assert.equal(detectiveMission().state.hintUsed,true);
m.state.found=[];detectivePending=false;chooseDetective(m.items[0].id);assert.equal(progress.earned.length,6,'Replay must not grant duplicate global stars');
progress.detective['pictures:bedroom']=null;assert.equal(detectiveMission().state.found.length,0,'Malformed mission state is repaired');
`,context);

let available=[],spoken=[],events=[];
const synth={getVoices:()=>available,cancel(){},speak:u=>spoken.push(u),addEventListener(){}};
const voiceContext=vm.createContext({window:{speechSynthesis:synth,SpeechSynthesisUtterance:function(){}},speechSynthesis:synth,SpeechSynthesisUtterance:function(text){this.text=text},document:{dispatchEvent:e=>events.push(e)},CustomEvent:function(type,detail){this.type=type;this.detail=detail},toast(){}});
vm.runInContext(fs.readFileSync('speech.js','utf8')+';globalThis.voice=TinyVoice;',voiceContext);
available=[{name:'US Natural',lang:'en-US',voiceURI:'us'},{name:'British basic',lang:'en-GB',voiceURI:'basic'},{name:'British Natural',lang:'en-GB',voiceURI:'natural'}];
assert.equal(voiceContext.voice.chosen('').voiceURI,'natural');
assert.equal(voiceContext.voice.chosen('basic').voiceURI,'basic');
assert.equal(voiceContext.voice.voices().length,2);
voiceContext.voice.speak('Hello',{sound:true,speed:.65});assert.equal(spoken.at(-1).lang,'en-GB');assert.equal(spoken.at(-1).pitch,1);assert.equal(spoken.at(-1).rate,.65);
const length=spoken.length;voiceContext.voice.speak('Silent',{sound:false,speed:1});assert.equal(spoken.length,length);
available=[{name:'US Natural',lang:'en-US',voiceURI:'us'}];assert.equal(voiceContext.voice.chosen(''),null,'Do not explicitly select a US voice as British');
available=[{name:'Late British',lang:'en_GB',voiceURI:'late'}];assert.equal(voiceContext.voice.chosen('').voiceURI,'late','Voices loaded later are recognised');
console.log('Passed: all 20 picture/word missions, A–Z/a–z, 0–100, incorrect choices, sequencing, saved discoveries, replay awards, malformed state, British voice selection, natural pitch, slow speed, mute, and late-loaded voices.');
