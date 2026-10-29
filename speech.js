'use strict';
// One voice service for lessons, tracing, questions and detective missions.
const TinyVoice = (() => {
  let activeUtterance=null, sequence=0;
  const supported=()=> 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const british=v=>/^en[-_](GB|UK)(?:[-_]|$)/i.test(v.lang);
  const score=v=>(/natural|neural|premium|enhanced/i.test(v.name)?100:0)+(/Google UK English Female|Sonia|Libby|Serena|Martha|Kate/i.test(v.name)?30:0)+(/Google|Microsoft/i.test(v.name)?10:0);
  function voices(){return supported()?speechSynthesis.getVoices().filter(british).sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name)):[]}
  function chosen(uri){const list=voices();return list.find(v=>v.voiceURI===uri)||list[0]||null}
  function announce(speaking){document.dispatchEvent(new CustomEvent('tiny-speaking',{detail:{speaking}}))}
  function stop(){sequence++;if(supported())speechSynthesis.cancel();activeUtterance=null;announce(false)}
  function speak(text,settings){
    stop();if(!settings.sound)return;
    if(!supported()){toast('Speaking is not available in this browser. Every clue is also written on screen.');return}
    const id=sequence, utterance=new SpeechSynthesisUtterance(String(text));
    utterance.lang='en-GB';utterance.rate=Math.min(1.2,Math.max(.5,Number(settings.speed)||.65));utterance.pitch=1;
    const voice=chosen(settings.voiceURI);if(voice)utterance.voice=voice;
    utterance.onstart=()=>{if(id===sequence)announce(true)};
    utterance.onend=()=>{if(id===sequence){activeUtterance=null;announce(false)}};
    utterance.onerror=e=>{if(id!==sequence)return;activeUtterance=null;announce(false);if(!['interrupted','canceled'].includes(e.error))toast('The voice could not play. Try Listen again, or check British voice settings.')};
    activeUtterance=utterance;speechSynthesis.speak(utterance);
  }
  function refresh(){
    const select=document.querySelector('#britishVoice'),status=document.querySelector('#voiceStatus');if(!select||!status)return;
    const list=voices(),selected=chosen(progress.voiceURI);
    select.replaceChildren(new Option('Automatic · best British voice',''));
    list.forEach(v=>select.add(new Option(v.name,v.voiceURI)));
    select.value=list.some(v=>v.voiceURI===progress.voiceURI)?progress.voiceURI:'';
    status.textContent=!supported()?'This browser has no speech service.':selected?'British English: '+selected.name+'. Natural pitch; your chosen speed applies everywhere.':'No British voice is listed yet. In your phone’s text-to-speech settings, add English (United Kingdom), then reopen Chrome. Until then, the browser chooses a voice for British English; the accent may vary.';
  }
  if(supported())speechSynthesis.addEventListener('voiceschanged',refresh);
  return {speak,stop,voices,chosen,refresh,british};
})();
