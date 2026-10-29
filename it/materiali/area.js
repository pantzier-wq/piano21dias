'use strict';
(() => {
 const $=id=>document.getElementById(id);
 const ROOT='/it/materiali/files/';
 const STORE='piano21-it-progress-v1', SESSION='piano21-it-access';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let course,key,access,progress={},audio,timer=null,beat=0,run=0,toastTimer;
 const cache=new Map(),urls=new Set();
 try {const p=JSON.parse(localStorage.getItem(STORE)||'{}');if(p&&typeof p==='object'&&!Array.isArray(p))progress=p;}catch{}
 function notify(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5000);}
 async function decrypt(name){const r=await fetch(ROOT+name,{cache:'no-cache'});if(!r.ok)throw Error('network');const b=new Uint8Array(await r.arrayBuffer());return crypto.subtle.decrypt({name:'AES-GCM',iv:b.slice(0,12)},key,b.slice(12));}
 function getAccess(){const fromLink=new URLSearchParams(location.hash.slice(1)).get('accesso');if(fromLink)return fromLink;try{return sessionStorage.getItem(SESSION);}catch{return null;}}
 async function unlock(){
  access=getAccess();if(!access)return;
  $('access-message').textContent='Apertura della tua biblioteca…';$('retry').hidden=true;
  try{
   if(!crypto.subtle)throw Error('unsupported');
   if(!/^[A-Za-z0-9_-]{43}$/.test(access))throw Error('access');
   const bytes=Uint8Array.from(atob(access.replace(/-/g,'+').replace(/_/g,'/')+'='),c=>c.charCodeAt(0));
   key=await crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['decrypt']);
   course=JSON.parse(new TextDecoder().decode(await decrypt('course.bin')));
   try{sessionStorage.setItem(SESSION,access);}catch{}
   if(location.hash)history.replaceState(null,'',location.pathname+location.search);
   $('access-screen').hidden=true;$('app').hidden=false;render();document.body.dataset.mainReady='true';document.dispatchEvent(new Event('piano-main-unlocked'));
  }catch(e){
   $('access-message').textContent=e.message==='unsupported'?'Questo browser non supporta l’apertura protetta dei materiali. Prova con una versione recente di Safari, Chrome, Firefox o Edge.':e.message==='network'?'Non riesco a scaricare i materiali. Controlla la connessione e riprova.':'Il link non è completo o non è quello corretto. Riapri la biblioteca dal pulsante nel PDF di benvenuto.';
   $('retry').hidden=false;
  }
 }
 $('retry').addEventListener('click',unlock);
 function setView(name){
  if(name!=='laboratorio')stopMetro();
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='view-'+name);
  document.querySelectorAll('.nav').forEach(n=>{n.classList.toggle('active',n.dataset.view===name);if(n.dataset.view===name)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
  $('main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});
 }
 function render(){
  const titles=['Pianoforte e Tastiera in 21 Giorni','Quaderno degli accordi','Schede per la tastiera','Un brano al giorno'];
  const descriptions=['Un percorso guidato per passare dai primi accordi a Prima Luce: una composizione completa di sedici battute.','Dodici posizioni da consultare durante la pratica, con note, dita suggerite e allenamento dei cambi.','56 cartoncini in due misure, più un piano per riconoscere le note e togliere gradualmente le etichette.','Tre passi per preparare una versione semplice di accompagnamento, con esempi e schede da riutilizzare.'];
  const features=[['21 sessioni: capire, praticare, verificare','Diagrammi, problemi risolti e risposte','Piano per continuare dopo il percorso'],['Forme base e posizioni vicine','Basso reale e accordi con barra','Coppie e sequenze per allenare i cambi'],['Stampa A4 a dimensioni reali','Formati 18 × 30 e 13 × 24 mm','12 sfide di riconoscimento e soluzioni'],['Tre esempi originali completi','Mappa del brano e diario di sette sessioni','Versioni a livelli e diagnosi pratica']];
  const images=['/it/imagens/hero-600.webp','/it/imagens/bonus-1-640.webp','/it/imagens/bonus-2-640.webp','/it/imagens/bonus-3-640.webp'];
  $('materials').innerHTML=course.materials.map((m,i)=>`<article class="material-card"><img class="material-image" src="${images[i]}" width="640" height="${i?640:480}" loading="lazy" alt="${esc(titles[i])}"><div class="material-copy"><span class="tag">${i?'BONUS '+i:'IL PERCORSO PRINCIPALE'} · ${m.pages} PAGINE · PDF</span><h2>${titles[i]}</h2><p>${descriptions[i]}</p><ul>${features[i].map(f=>`<li>${f}</li>`).join('')}</ul><div class="button-row"><button class="primary" data-pdf="${i}" type="button">Apri PDF</button><button class="secondary" data-download="${i}" type="button">Scarica ↓</button></div></div></article>`).join('');
  let html='';course.days.forEach((d,i)=>{
   if(i%7===0)html+=`<h3 class="week-title">FASE ${Math.floor(i/7)+1} · ${['ORIENTARSI','COORDINARE','SUONARE'][Math.floor(i/7)]}</h3>`;
   const p=11+i*3;
   html+=`<details class="lesson${progress[d.n]?' done':''}" id="lesson-${d.n}"><summary><span class="lesson-no">${String(d.n).padStart(2,'0')}</span><span class="lesson-title">${esc(d.title)}<small>Manuale · pagine ${p}-${p+2}</small></span></summary><div class="lesson-body"><p class="lesson-goal">${esc(d.goal)}</p><h3>Il tuo promemoria</h3><ol>${d.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="lesson-criterion"><b>Puoi proseguire quando:</b> ${esc(d.criterion)}</p><p class="lesson-criterion"><b>Versione minima:</b> ${esc(d.minimum)}</p><div class="button-row"><button type="button" class="secondary" data-pdf="0" data-page="${p}">Apri la sessione nel manuale ↗</button><button type="button" class="text-button" data-goto="laboratorio">Ascolta un accordo</button></div><label class="lesson-complete"><input type="checkbox" data-complete="${d.n}" ${progress[d.n]?'checked':''}>Ho praticato questa sessione</label><p class="small">Puoi ripeterla anche dopo averla segnata. Il progresso riguarda la pratica, non la perfezione.</p></div></details>`;
  });$('lessons').innerHTML=html;
  $('chord').innerHTML=course.chords.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  updateProgress();renderKeyboard();
 }
 function updateProgress(){const n=course.days.filter(d=>progress[d.n]).length;$('done-count').textContent=n;$('course-progress').value=n;$('course-progress').textContent=n+' / 21';$('continue').textContent=n===21?'Riprendi una sessione →':'Continua dalla sessione '+String((course.days.find(d=>!progress[d.n])||course.days[0]).n).padStart(2,'0')+' →';}
 document.addEventListener('click',async e=>{
  const nav=e.target.closest('[data-view],[data-goto]');if(nav){setView(nav.dataset.view||nav.dataset.goto);return;}
  const btn=e.target.closest('[data-pdf],[data-download]');if(btn){const download=btn.hasAttribute('data-download');const i=Number(btn.dataset.pdf??btn.dataset.download);if(!download){openPDF(i,Number(btn.dataset.page)||1);return;}btn.disabled=true;try{const url=await pdfURL(i);const a=document.createElement('a');a.href=url;a.download=course.materials[i].file;document.body.appendChild(a);a.click();a.remove();}catch{notify('Download non riuscito. Controlla la connessione e riprova.');}finally{btn.disabled=false;}}
 });
 document.addEventListener('change',e=>{const id=e.target.dataset.complete;if(!id)return;if(e.target.checked)progress[id]=new Date().toISOString();else delete progress[id];try{localStorage.setItem(STORE,JSON.stringify(progress));}catch{notify('Il browser non consente di salvare il progresso. Puoi scaricare il registro.');}$('lesson-'+id).classList.toggle('done',e.target.checked);updateProgress();});
 $('continue').addEventListener('click',()=>{const d=course.days.find(d=>!progress[d.n])||course.days[0];const el=$('lesson-'+d.n);el.open=true;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});});
 $('reset-progress').addEventListener('click',()=>{if(!confirm('Vuoi azzerare soltanto il progresso salvato in questo browser?'))return;progress={};try{localStorage.removeItem(STORE);}catch{}document.querySelectorAll('[data-complete]').forEach(c=>c.checked=false);document.querySelectorAll('.lesson').forEach(l=>l.classList.remove('done'));updateProgress();});
 $('export-progress').addEventListener('click',()=>{const text='IL MIO PERCORSO - METODO MANCIATA DI TASTI\n\n'+course.days.map(d=>`${progress[d.n]?'[x]':'[ ]'} ${String(d.n).padStart(2,'0')} ${d.title}${progress[d.n]?' - '+new Date(progress[d.n]).toLocaleDateString('it-IT'):''}`).join('\n');const u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='Il_mio_registro_21_sessioni.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
 async function pdfURL(i){if(cache.has(i))return cache.get(i);const pending=decrypt(String(i+1).padStart(2,'0')+'.bin').then(raw=>{const url=URL.createObjectURL(new Blob([raw],{type:'application/pdf'}));urls.add(url);return url;}).catch(e=>{cache.delete(i);throw e;});cache.set(i,pending);return pending;}
 let viewerRequest=0;
 async function openPDF(i,page){stopMetro();const request=++viewerRequest;$('pdf-title').textContent=course.materials[i].file.replace(/^\d+_|\.pdf$/g,'').replace(/_/g,' ');$('pdf-status').textContent='Preparazione del PDF…';$('pdf-status').hidden=false;$('pdf-frame').hidden=true;$('viewer-actions').hidden=true;if(!$('pdf-dialog').open)$('pdf-dialog').showModal();try{const url=await pdfURL(i);if(request!==viewerRequest||!$('pdf-dialog').open)return;$('pdf-download').href=url;$('pdf-download').download=course.materials[i].file;$('pdf-new-tab').href=url+'#page='+page;$('pdf-frame').src=url+'#page='+page+'&view=FitH';$('pdf-frame').hidden=false;$('viewer-actions').hidden=false;$('pdf-status').hidden=true;}catch{$('pdf-status').textContent='Non riesco ad aprire il materiale. Controlla la connessione, chiudi questa finestra e riprova.';}}
 $('close-pdf').addEventListener('click',()=>$('pdf-dialog').close());$('pdf-dialog').addEventListener('close',()=>{viewerRequest++;$('pdf-frame').removeAttribute('src');});
 function audioContext(){if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio;}
 function tone(midi,delay=0,duration=1,volume=.13){const ctx=audioContext(),t=ctx.currentTime+delay;const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+duration+.02);}
 const noteNames=['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','Sib','Si'];
 function selectedChord(){return course.chords.find(c=>c.id===$('chord').value)||course.chords[0];}
 function renderKeyboard(){const c=selectedChord(),start=Math.min(...c.notes)<60?48:60;const whiteNotes=[];for(let n=start;n<=start+24;n++)if([0,2,4,5,7,9,11].includes(n%12))whiteNotes.push(n);$('keyboard').replaceChildren();whiteNotes.forEach((n,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='key'+(c.notes.includes(n)?' active':'');btn.textContent=noteNames[n%12];btn.setAttribute('aria-label',noteNames[n%12]+' '+(Math.floor(n/12)-1));btn.addEventListener('click',()=>tone(n));$('keyboard').appendChild(btn);if([0,2,5,7,9].includes(n%12)&&i<whiteNotes.length-1){const black=document.createElement('button');black.type='button';black.className='key black'+(c.notes.includes(n+1)?' active':'');black.textContent=noteNames[(n+1)%12];black.setAttribute('aria-label',black.textContent+' '+(Math.floor((n+1)/12)-1));black.style.left=((i+1-.3)/whiteNotes.length*100)+'%';black.style.width=(.6/whiteNotes.length*100)+'%';black.addEventListener('click',()=>tone(n+1));$('keyboard').appendChild(black);}});$('chord-notes').textContent=c.notes.map(n=>noteNames[n%12]).join(' · ');$('chord-hint').textContent=c.why;}
 $('chord').addEventListener('change',()=>{run++;renderKeyboard();});
 $('play-chord').addEventListener('click',()=>{try{run++;selectedChord().notes.forEach(n=>tone(n,0,1.7,.11));}catch{notify('Audio non disponibile in questo browser. Prova un browser aggiornato.');}});
 $('play-notes').addEventListener('click',()=>{try{run++;selectedChord().notes.forEach((n,i)=>tone(n,i*.8,.75,.16));}catch{notify('Audio non disponibile in questo browser.');}});
 $('bpm').addEventListener('input',()=>$('bpm-value').value=$('bpm').value);
 function stopMetro(){if(timer!==null)clearTimeout(timer);timer=null;beat=0;$('toggle-metronome').textContent='Avvia il metronomo';$('toggle-metronome').setAttribute('aria-pressed','false');document.querySelectorAll('#beats span').forEach(b=>b.classList.remove('current'));}
 function tick(){const ctx=audioContext();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=beat===0?1000:700;g.gain.setValueAtTime(.14,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.055);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.06);document.querySelectorAll('#beats span').forEach((b,i)=>b.classList.toggle('current',i===beat));beat=(beat+1)%4;timer=setTimeout(tick,60000/Number($('bpm').value));}
 $('toggle-metronome').addEventListener('click',()=>{if(timer!==null){stopMetro();return;}try{audioContext();$('toggle-metronome').textContent='Ferma il metronomo';$('toggle-metronome').setAttribute('aria-pressed','true');tick();}catch{stopMetro();notify('Audio non disponibile in questo browser.');}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMetro();});
 $('exit').addEventListener('click',()=>{stopMetro();try{sessionStorage.removeItem(SESSION);}catch{}urls.forEach(u=>URL.revokeObjectURL(u));cache.clear();urls.clear();course=null;key=null;access=null;$('app').hidden=true;$('access-screen').hidden=false;$('access-message').textContent='Accesso chiuso. Puoi riaprirlo dal tuo PDF di benvenuto. Il progresso resta salvato in questo browser.';window.scrollTo(0,0);});
 window.addEventListener('hashchange',()=>{if(location.hash.includes('accesso='))unlock();});
 unlock();
})();
