'use strict';
let detectiveKind='pictures',detectivePage=0,detectiveCase='upper',detectiveLights=false,detectiveMessage='',detectivePending=false,detectiveMissionKey='';

function detectiveState(key,items){
  progress.detective ||= {};
  if(!progress.detective[key]||typeof progress.detective[key]!=='object'||Array.isArray(progress.detective[key]))progress.detective[key]={found:[],hintUsed:false};
  const state=progress.detective[key];
  state.found=Array.isArray(state.found)?[...new Set(state.found)].filter(id=>items.some(it=>it.id===id)):[];
  state.hintUsed=Boolean(state.hintUsed);
  return state;
}
function detectiveMission(){
  const w=WORLDS[worldIndex];let items,key,title;
  if(detectiveKind==='pictures'||detectiveKind==='words'){
    items=w.items.map(it=>({...it,world:w.id}));key=detectiveKind+':'+w.id;title=w.name;
  }else{
    const alphabet=detectiveCase==='upper'?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'abcdefghijklmnopqrstuvwxyz';
    const source=detectiveKind==='letters'?[...alphabet]:Array.from({length:101},(_,i)=>String(i));
    items=Array.from({length:6},(_,i)=>{const value=source[(detectivePage*6+i)%source.length];return{id:value,name:value,sentence:detectiveKind==='letters'?spokenChar(value):'The number '+value}});
    key=detectiveKind+':'+(detectiveKind==='letters'?detectiveCase+':':'')+detectivePage;title=detectiveKind==='letters'?'Letter detectives':'Number detectives';
  }
  return {w,items,key,title,state:detectiveState(key,items)};
}
function detectiveTarget(m){return m.items.find(it=>!m.state.found.includes(it.id))}
function detectivePrompt(m){const it=detectiveTarget(m);if(!it)return 'Six stars! You found every hidden treasure.';return detectiveKind==='letters'?'Find '+spokenChar(it.name)+'.':detectiveKind==='numbers'?'Find the number '+it.name+'.':detectiveKind==='words'?'Find the word “'+it.name+'”.':(m.w.id==='feelings'?'Find the '+it.name+' face.':'Find the '+it.name+'.')}
function teacherSVG(){return `<svg class="detective-teacher" viewBox="0 0 100 112" aria-hidden="true"><path d="M12 108V69C12 14 31 4 50 4s38 10 38 65v39" fill="#8058b2"/><path d="M19 104Q50 76 81 104" fill="#a588c7"/><ellipse cx="50" cy="48" rx="25" ry="31" fill="#eac49f"/><path d="M24 40Q49 29 59 16Q76 31 77 46V23L50 8 23 23Z" fill="#66428f"/><path d="M25 60Q31 91 52 96Q27 96 17 85V53M75 60Q68 88 48 98Q76 98 85 84V53" fill="#9977bd"/><g class="teacher-eyes" fill="#483a4c"><ellipse cx="40" cy="47" rx="2.5" ry="3.5"/><ellipse cx="60" cy="47" rx="2.5" ry="3.5"/></g><ellipse cx="32" cy="58" rx="5" ry="3" fill="#e8a6a4"/><ellipse cx="68" cy="58" rx="5" ry="3" fill="#e8a6a4"/><path d="M44 63Q50 69 56 63" fill="none" stroke="#975366" stroke-width="2.5" stroke-linecap="round"/><ellipse class="teacher-mouth" cx="50" cy="65" rx="5" ry="4" fill="#975366"/><path d="M79 101q8-17 13-19" fill="none" stroke="#eac49f" stroke-width="7" stroke-linecap="round"/><path d="M88 85l1-10m3 8 4-7" stroke="#eac49f" stroke-width="3.5" stroke-linecap="round"/></svg>`}
function detectiveBanner(){return `<div class="detective-banner"><span aria-hidden="true">🔦</span><div><b>A little discovery mission?</b><small>Listen, shine your torch, and find six treasures.</small></div><button class="small-button" id="launchDetective">Let's investigate →</button><button class="text-button" id="bannerMyWords">📖 My Words</button></div>`}
function mountDetectiveBanner(){
  const main=$('#main');if(!main||view==='detective')return;
  main.querySelector('.intro')?.insertAdjacentHTML('afterend',detectiveBanner());
  $('#bannerMyWords').onclick=openMyWords;
  $('#launchDetective').onclick=()=>{detectiveKind=view==='tracing'?mode==='letters'?'letters':mode==='numbers'?'numbers':'words':'pictures';detectivePage=0;detectiveMessage='';detectivePending=false;navigate('detective')};
}
function openDetective(kind=detectiveKind){detectiveKind=kind;detectiveMessage='';detectivePending=false;navigate('detective')}
function renderDetective(){
  const m=detectiveMission(),done=m.state.found.length===6;
  const traceItem=m.items.find(it=>it.id===m.state.found.at(-1))||detectiveTarget(m)||m.items[0];
  if(detectiveMissionKey!==m.key){detectiveMissionKey=m.key;detectiveMessage='';detectivePending=false}
  const selectedWorld=`<label>Choose a theme<select id="detectiveWorld">${WORLD_GROUPS.map(g=>`<optgroup label="${esc(g.name)}">${WORLDS.map((w,i)=>w.group===g.id?`<option value="${i}" ${i===worldIndex?'selected':''}>${w.emoji} ${esc(w.name)}</option>`:'').join('')}</optgroup>`).join('')}</select></label>`;
  const glyphPicker=`${detectiveKind==='letters'?`<label>Letter case<select id="detectiveCase"><option value="upper" ${detectiveCase==='upper'?'selected':''}>Capital A B C</option><option value="lower" ${detectiveCase==='lower'?'selected':''}>Lowercase a b c</option></select></label>`:''}<label>Choose a set<select id="detectiveSet">${Array.from({length:detectiveKind==='letters'?5:17},(_,n)=>`<option value="${n}" ${detectivePage===n?'selected':''}>${detectiveKind==='letters'?(n===4?(detectiveCase==='upper'?'Y, Z, A, B, C, D':'y, z, a, b, c, d'):`${(detectiveCase==='upper'?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'abcdefghijklmnopqrstuvwxyz')[n*6]} – ${(detectiveCase==='upper'?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'abcdefghijklmnopqrstuvwxyz')[(n*6+5)%26]}`):`${n*6} – ${n===16?'100, then 0':n*6+5}`}</option>`).join('')}</select></label>`;
  const board=detectiveKind==='pictures'?largeScene(m.w):`<div class="detective-symbols" role="group" aria-label="Hidden ${detectiveKind}">${[2,5,0,4,1,3].map(i=>`<button class="detective-symbol ${detectiveKind==='words'?'is-word':''}" data-find="${esc(m.items[i].id)}" aria-label="${esc(m.items[i].sentence)}"><span>${esc(m.items[i].name)}</span><i aria-hidden="true">✧</i></button>`).join('')}</div>`;
  $('#main').innerHTML=`${intro('THE FLASHLIGHT WORD DETECTIVE','Little torch.<br><span class="accent">Big discoveries.</span>','A listening adventure for curious little explorers.',false)}<div class="detective-layout"><section class="detective-play"><div class="detective-modes" aria-label="Choose detective activity">${[['pictures','🏡','Picture worlds'],['letters','Aa','Letters'],['numbers','123','Numbers'],['words','abc','Words']].map(([id,s,label])=>`<button data-detective-kind="${id}" aria-pressed="${detectiveKind===id}" class="${detectiveKind===id?'active':''}"><span aria-hidden="true">${s}</span>${label}</button>`).join('')}</div><div class="detective-picker">${['pictures','words'].includes(detectiveKind)?selectedWorld:glyphPicker}</div><div class="detective-guide">${teacherSVG()}<div><span class="eyebrow">YOUR DISCOVERY GUIDE</span><h2 id="detectiveClue">${esc(detectivePending?'Well done, detective!':detectivePrompt(m))}</h2><p id="detectiveFeedback" role="status">${esc(detectiveMessage||(done?'Your six treasures are saved. You can play again or choose a new adventure.':'Move your finger or mouse to shine the torch. Tap what you find.'))}</p></div><button class="sound-disc" id="listenClue" aria-label="Listen to the clue">${icon('sound')}</button></div><div class="detective-board ${detectiveLights||done?'lights-on':''}" id="detectiveBoard" style="--torch-x:50%;--torch-y:50%"><div class="detective-art">${board}</div><div class="torch-shade" aria-hidden="true"></div><div class="torch-ring" aria-hidden="true"></div><span class="torch-label" aria-hidden="true">🔦 Move to explore</span></div><div class="detective-controls"><button id="detectiveHint" class="small-button" ${m.state.hintUsed||done||detectivePending?'disabled':''}>💡 ${m.state.hintUsed?'Hint used':'One hint'}</button><button id="detectiveLight" class="small-button" aria-pressed="${detectiveLights}">${detectiveLights?'🌙 Torch mode':'☀ Lights on'}</button><button id="nextClue" class="primary" ${!detectivePending||done?'hidden':''}>Next clue ${icon('arrow')}</button>${done?'<button id="detectiveAgain" class="primary">Play again '+icon('reset')+'</button>':''}</div><p class="detective-access">You can turn the lights on at any time. With a keyboard, use Tab to explore and Enter to choose.</p></section><aside class="detective-side"><section class="mission-card"><span class="eyebrow">YOUR SIX-STAR MISSION</span><h2>${esc(m.title)}</h2><div class="mission-stars" id="missionStars" aria-label="${m.state.found.length} of 6 stars">${m.items.map(it=>`<span class="${m.state.found.includes(it.id)?'earned':''}" aria-hidden="true">★</span>`).join('')}</div><progress id="missionProgress" max="6" value="${m.state.found.length}" aria-label="Treasures discovered"></progress><p id="missionCount">${m.state.found.length} / 6 treasures discovered</p><div class="mission-treasures">${m.items.map(it=>`<span class="${m.state.found.includes(it.id)?'found':''}">${m.state.found.includes(it.id)?'✓ '+esc(it.name):'?'}</span>`).join('')}</div><button class="collection-button" id="openMyWords">📖 My Words <span>${collectionItems().length}</span></button><p class="mission-note">Your discoveries stay here for your next visit.</p></section><section class="detective-next"><span aria-hidden="true">✏️</span><h3>Discover it. Then trace it.</h3><p>Keep learning with little lines and big questions.</p><button class="small-button" id="detectiveTrace">Try tracing →</button><button class="text-button" id="detectiveQuestions">Explore & answer questions →</button></section></aside></div>`;
  $$('[data-detective-kind]').forEach(b=>b.onclick=()=>{detectivePage=0;openDetective(b.dataset.detectiveKind)});
  if($('#detectiveWorld'))$('#detectiveWorld').onchange=e=>{worldIndex=+e.target.value;selectedItem=null;detectiveMessage='';detectivePending=false;renderDetective()};
  if($('#detectiveCase'))$('#detectiveCase').onchange=e=>{detectiveCase=e.target.value;detectiveMessage='';detectivePending=false;renderDetective()};
  if($('#detectiveSet'))$('#detectiveSet').onchange=e=>{detectivePage=+e.target.value;detectiveMessage='';detectivePending=false;renderDetective()};
  $('#listenClue').onclick=()=>speak(detectivePrompt(detectiveMission()));
  $('#detectiveLight').onclick=()=>{detectiveLights=!detectiveLights;renderDetective()};
  $('#detectiveHint').onclick=useDetectiveHint;
  $('#nextClue').onclick=()=>{detectivePending=false;detectiveMessage='Listen to the next clue. You can do this!';renderDetective();speak(detectivePrompt(detectiveMission()))};
  if($('#detectiveAgain'))$('#detectiveAgain').onclick=()=>{m.state.found=[];m.state.hintUsed=false;detectiveMessage='A fresh mission! Let us find six treasures.';detectivePending=false;save();renderDetective();speak(detectivePrompt(detectiveMission()))};
  $('#openMyWords').onclick=openMyWords;
  $('#detectiveTrace').onclick=()=>{if(['letters','numbers'].includes(detectiveKind)){mode=detectiveKind;traceText=traceItem.name;charIndex=0;navigate('tracing')}else startWordTrace(traceItem.name)};
  $('#detectiveQuestions').onclick=()=>{qIndex=0;selectedItem=null;navigate('lesson')};
  bindTorch(m);markDetectiveFound(m);
}
function torchAt(x,y){const board=$('#detectiveBoard');if(!board)return;const r=board.getBoundingClientRect();board.style.setProperty('--torch-x',Math.max(0,Math.min(r.width,x-r.left))+'px');board.style.setProperty('--torch-y',Math.max(0,Math.min(r.height,y-r.top))+'px')}
function shineOn(el){
  const board=$('#detectiveBoard'),svg=$('.context-scene',board);
  if(svg&&el.dataset.item){
    const objects=SCENES[WORLDS[worldIndex].id].objects,index=objects.findIndex(o=>o[0]===el.dataset.item),o=objects[index];
    if(o){const [,x,y,w,h]=o;let point=[x+w/2,y+h/2];
      outer:for(const fy of [.5,.15,.85,.3,.7])for(const fx of [.5,.15,.85,.3,.7]){const px=x+w*fx,py=y+h*fy;if(!objects.slice(index+1).some(([,ox,oy,ow,oh])=>px>=ox-5&&px<=ox+Math.max(48,ow)+5&&py>=oy-5&&py<=oy+Math.max(48,oh)+5)){point=[px,py];break outer}}
      const r=svg.getBoundingClientRect();torchAt(r.x+point[0]/720*r.width,r.y+point[1]/440*r.height);return;
    }
  }
  const r=el.getBoundingClientRect();torchAt(r.x+r.width/2,r.y+r.height/2)
}
function bindTorch(m){
  const board=$('#detectiveBoard');let down=null;
  board.onpointermove=e=>{torchAt(e.clientX,e.clientY);if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>12)down.dragged=true};
  board.onpointerdown=e=>{torchAt(e.clientX,e.clientY);down={x:e.clientX,y:e.clientY,dragged:false}};
  board.onpointercancel=()=>{down=null};
  $$('[data-item],[data-find]',board).forEach(el=>{
    const id=el.dataset.item||el.dataset.find;
    el.setAttribute('aria-label',detectiveKind==='pictures'?'Choose '+m.items.find(it=>it.id===id).name:el.getAttribute('aria-label'));
    el.onfocus=()=>shineOn(el);
    el.onclick=e=>{if(down?.dragged){down=null;return}down=null;torchAt(e.clientX||el.getBoundingClientRect().x,e.clientY||el.getBoundingClientRect().y);chooseDetective(id)};
    el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();down=null;shineOn(el);chooseDetective(id)}};
  });
}
function markDetectiveFound(m){
  $$('[data-item],[data-find]',$('#detectiveBoard')).forEach(el=>{const found=m.state.found.includes(el.dataset.item||el.dataset.find);el.classList.remove('selected');el.classList.toggle('detective-found',found);el.setAttribute('aria-pressed',String(found))});
}
function chooseDetective(id){
  const m=detectiveMission(),it=m.items.find(it=>it.id===id),target=detectiveTarget(m);if(!it||!target)return;
  if(m.state.found.includes(id)){speak(it.name+'. You have already found this one.');return}
  if(detectivePending){speak('Tap Next clue when you are ready.');return}
  if(id!==target.id){detectiveMessage='Good exploring! '+it.sentence+' '+detectivePrompt(m);$('#detectiveFeedback').textContent=detectiveMessage;speak(detectiveMessage);return}
  m.state.found.push(id);
  if(it.world){progress.seen[it.world]||=[];if(!progress.seen[it.world].includes(id))progress.seen[it.world].push(id)}
  save();award('detective:'+m.key+':'+id,'Brilliant detective work! You found '+it.name+'.');
  const done=m.state.found.length===6;detectiveMessage=done?'Wonderful! Six treasures and six bright stars.':'You found “'+it.name+'”! Tap Next clue when you are ready.';detectivePending=!done;
  renderDetective();speak(done?'Wonderful detective work! You found all six treasures.': 'Well done! '+it.sentence+' Tap Next clue when you are ready.');
  if(!done)$('#nextClue').focus({preventScroll:true});
}
function useDetectiveHint(){
  const m=detectiveMission(),target=detectiveTarget(m);if(!target||m.state.hintUsed||detectivePending)return;
  m.state.hintUsed=true;save();$('#detectiveHint').disabled=true;$('#detectiveHint').textContent='💡 Hint used';
  const el=$$('[data-item],[data-find]',$('#detectiveBoard')).find(el=>(el.dataset.item||el.dataset.find)===target.id);
  if(el){shineOn(el);el.classList.add('hint-glow');setTimeout(()=>el.classList.remove('hint-glow'),4000)}
  $('#detectiveFeedback').textContent='Follow the glow! '+detectivePrompt(m);speak('Follow the glow. '+detectivePrompt(m));
}
function collectionItems(){return WORLDS.flatMap(w=>w.items.filter(it=>(progress.seen[w.id]||[]).includes(it.id)).map(it=>({w,it})))}
function collectionArt(w,it){const i=w.items.indexOf(it);return w.id==='shapes'?`<svg class="collection-art" viewBox="0 0 140 140" aria-hidden="true">${ART[it.id]}</svg>`:`<span class="collection-art" style="background-image:url('${w.id}.png');background-position:${(i%3)*50}% ${Math.floor(i/3)*100}%" aria-hidden="true"></span>`}
function openMyWords(){
  const dialog=$('#myWords'),items=collectionItems();
  dialog.innerHTML=`<div class="dialog-top"><div><span class="eyebrow">MY LITTLE WORD COLLECTION</span><h2 id="myWordsTitle">Look what you found!</h2></div><button class="icon-button" id="closeMyWords" aria-label="Close My Words">✕</button></div><p>${items.length} picture words discovered. Tap to listen again.</p><label class="collection-filter">Show a theme<select id="collectionTheme"><option value="all">All my words</option>${WORLDS.filter(w=>items.some(x=>x.w.id===w.id)).map(w=>`<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select></label><div class="collection-grid">${items.map(({w,it})=>`<button class="collection-word" data-collection="${w.id}:${it.id}" data-collection-world="${w.id}">${collectionArt(w,it)}<b>${esc(it.name)}</b><small>${esc(w.name)}</small></button>`).join('')}</div>${items.length?'':'<div class="collection-empty">🔦<h3>Your first discovery is waiting.</h3><p>Find a picture in a mission or tap one in a theme to save it here.</p></div>'}`;
  $('#closeMyWords').onclick=()=>dialog.close();
  $('#collectionTheme').onchange=e=>$$('[data-collection-world]').forEach(el=>el.hidden=e.target.value!=='all'&&el.dataset.collectionWorld!==e.target.value);
  $$('[data-collection]').forEach(b=>b.onclick=()=>{const [wid,id]=b.dataset.collection.split(':'),w=WORLDS.find(w=>w.id===wid),it=w.items.find(it=>it.id===id);speak(it.name+'. '+it.sentence)});
  dialog.showModal();
}
document.addEventListener('tiny-speaking',e=>{document.querySelectorAll('.detective-teacher').forEach(el=>el.classList.toggle('speaking',e.detail.speaking&&progress.motion))});
