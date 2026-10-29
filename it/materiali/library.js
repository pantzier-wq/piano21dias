/* The code is not embedded here. PBKDF2 derives a separate key for encrypted paid assets. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),ROOT='/it/materiali/library/',SESSION='piano21-it-library-code';
 let key=null,catalog=null,generation=0,viewerGeneration=0,mainReady=document.body.dataset.mainReady==='true';
 const cache=new Map(),urls=new Set();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mainNav(){
  document.querySelectorAll('.nav:not([data-view="biblioteca"])').forEach(el=>el.hidden=!mainReady);
  $('library-main-access').hidden=mainReady;
 }
 function openLibrary(){
  $('access-screen').hidden=true;$('app').hidden=false;mainNav();
  document.querySelector('.nav[data-view="biblioteca"]').click();
 }
 document.addEventListener('piano-main-unlocked',()=>{mainReady=true;mainNav();});
 $('library-entry').addEventListener('click',openLibrary);
 $('library-main-access').addEventListener('click',()=>{
  lock();$('app').hidden=true;$('access-screen').hidden=false;
  history.replaceState(null,'',location.pathname+location.search);
 });
 async function bytes(name){
  const r=await fetch(ROOT+name,{cache:'no-cache'});if(!r.ok)throw Error('network');
  return new Uint8Array(await r.arrayBuffer());
 }
 async function decrypt(name,k){const b=await bytes(name);return crypto.subtle.decrypt({name:'AES-GCM',iv:b.slice(0,12)},k,b.slice(12));}
 function revoke(){document.querySelectorAll('#library-audios audio').forEach(a=>{a.pause();a.removeAttribute('src');a.load();});urls.forEach(u=>URL.revokeObjectURL(u));urls.clear();cache.clear();}
 function lock(){
  generation++;viewerGeneration++;revoke();key=null;catalog=null;
  try{sessionStorage.removeItem(SESSION);}catch{}
  $('library-code').value='';$('library-content').hidden=true;$('library-lock').hidden=false;
  $('library-status').textContent='Inserisci il codice riportato nel PDF di accesso ricevuto con il tuo acquisto.';
  $('library-submit').disabled=false;$('library-submit').textContent='Sblocca la biblioteca';
  $('library-audios').replaceChildren();$('library-chapters').replaceChildren();
  $('library-frame').removeAttribute('src');if($('library-dialog').open)$('library-dialog').close();
 }
 $('library-relock').addEventListener('click',()=>{lock();$('library-code').focus();});
 $('exit').addEventListener('click',()=>{lock();mainReady=false;document.body.dataset.mainReady='false';});
 $('library-form').addEventListener('submit',e=>{e.preventDefault();unlock($('library-code').value);});
 async function unlock(code){
  const run=++generation;
  const normalized=code.toUpperCase().replace(/[\s-]/g,'');
  if(!/^PSB[A-HJ-NP-Z2-9]{20}$/.test(normalized)){
   $('library-status').textContent='Il codice non è completo. Copialo dal tuo PDF di accesso, incluso il prefisso PSB.';return;
  }
  $('library-submit').disabled=true;$('library-status').textContent='Verifica del codice e apertura della biblioteca…';
  try{
   if(!crypto.subtle)throw Error('unsupported');
   const configResponse=await fetch(ROOT+'config.json',{cache:'no-cache'});if(!configResponse.ok)throw Error('network');
   const cfg=await configResponse.json();
   const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(normalized),'PBKDF2',false,['deriveKey']);
   const candidate=await crypto.subtle.deriveKey({name:'PBKDF2',salt:Uint8Array.from(atob(cfg.salt),c=>c.charCodeAt(0)),iterations:cfg.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
   const data=JSON.parse(new TextDecoder().decode(await decrypt('catalog.bin',candidate)));
   if(run!==generation)return;
   key=candidate;catalog=data;
   try{sessionStorage.setItem(SESSION,normalized);}catch{}
   $('library-code').value='';render();$('library-lock').hidden=true;$('library-content').hidden=false;
   $('library-status').textContent='Biblioteca sbloccata.';
  }catch(e){if(run!==generation)return;
   $('library-status').textContent=e.message==='unsupported'?'Per aprire i materiali usa un browser aggiornato, come Safari, Chrome, Firefox o Edge.':e.message==='network'||e instanceof TypeError?'Connessione non riuscita. Controlla la rete e riprova.':'Codice non valido. Controlla il PDF di accesso della biblioteca aggiuntiva e riprova.';
  }finally{if(run===generation)$('library-submit').disabled=false;}
 }
 function render(){
  $('library-chapters').innerHTML=catalog.chapters.map(c=>`<button type="button" class="chapter-link" data-library-page="${c.page}"><span>${esc(c.title)}</span><small>Pagina ${c.page} ↗</small></button>`).join('');
  $('library-audios').innerHTML=['Direzione','Nota','Accordo'].map(group=>`<section class="audio-group"><h3>${{Direzione:'01–08 · Direzione del suono',Nota:'09–16 · La nota dopo il Do',Accordo:'17–24 · Maggiore o minore'}[group]}</h3><p class="small">${{Direzione:'Il secondo suono sale, scende o resta uguale?',Nota:'Scegli tra Do, Re, Mi e Sol.',Accordo:'Ascolta la fondamentale e poi l’accordo: maggiore o minore?'}[group]}</p><div class="audio-grid">${catalog.audio.filter(a=>a.group===group).map(a=>`<article class="audio-card"><h4>Audio ${String(a.id).padStart(2,'0')}</h4><p>${esc(a.title.slice(5))}</p><button type="button" class="secondary" data-library-audio="${a.id}">Carica e ascolta ▶</button><audio controls preload="none" id="library-audio-${a.id}" aria-label="Audio ${a.id}" hidden></audio><span class="small" role="status"></span></article>`).join('')}</div></section>`).join('');
 }
 async function assetURL(name,type){
  if(!key)throw Error('locked');if(cache.has(name))return cache.get(name);
  const run=generation,k=key;
  const p=decrypt(name,k).then(raw=>{if(run!==generation||!key)throw Error('locked');const u=URL.createObjectURL(new Blob([raw],{type}));urls.add(u);return u;}).catch(e=>{if(run===generation)cache.delete(name);throw e;});
  cache.set(name,p);return p;
 }
 async function openPDF(page=1){
  if(!key||!catalog)return;const run=++viewerGeneration;
  $('library-pdf-status').textContent='Preparazione del manuale…';$('library-pdf-status').hidden=false;
  $('library-frame').hidden=true;$('library-viewer-actions').hidden=true;
  if(!$('library-dialog').open)$('library-dialog').showModal();
  try{
   const u=await assetURL('manual.bin','application/pdf');if(run!==viewerGeneration||!$('library-dialog').open)return;
   $('library-frame').src=u+'#page='+page+'&view=FitH';$('library-frame').hidden=false;
   $('library-pdf-download').href=u;$('library-pdf-download').download=catalog.manual;
   $('library-pdf-new-tab').href=u+'#page='+page;
   $('library-viewer-actions').hidden=false;$('library-pdf-status').hidden=true;
  }catch{if(run===viewerGeneration)$('library-pdf-status').textContent='Non riesco ad aprire il manuale. Controlla la connessione e riprova.';}
 }
 $('library-pdf-open').addEventListener('click',()=>openPDF());
 $('library-close-pdf').addEventListener('click',()=>$('library-dialog').close());
 $('library-dialog').addEventListener('close',()=>{viewerGeneration++;$('library-frame').removeAttribute('src');});
 document.addEventListener('click',async e=>{
  const page=e.target.closest('[data-library-page]');if(page){openPDF(Number(page.dataset.libraryPage));return;}
  const btn=e.target.closest('[data-library-audio]');if(!btn||!catalog||!key)return;
  const a=catalog.audio.find(a=>a.id===Number(btn.dataset.libraryAudio)),run=generation;btn.disabled=true;
  const status=btn.parentElement.querySelector('[role="status"]');status.textContent='Caricamento…';
  try{const u=await assetURL(a.asset,'audio/mpeg');if(run!==generation)return;
   const player=$('library-audio-'+a.id);player.src=u;player.hidden=false;btn.hidden=true;status.textContent='';
   // Playback remains an explicit gesture on browsers that disallow async autoplay.
   try{await player.play();}catch{status.textContent='Premi ▶ sul lettore per ascoltare.';}
  }catch{if(run===generation){status.textContent='Audio non disponibile. Controlla la rete e riprova.';btn.disabled=false;}}
 });
 document.addEventListener('play',e=>{if(e.target.matches('#library-audios audio'))document.querySelectorAll('#library-audios audio').forEach(a=>{if(a!==e.target)a.pause();});},true);
 document.addEventListener('click',e=>{const nav=e.target.closest('[data-view],[data-goto]');if(nav&&(nav.dataset.view||nav.dataset.goto)!=='biblioteca')document.querySelectorAll('#library-audios audio').forEach(a=>a.pause());});
 async function download(name,type,filename,button){
  button.disabled=true;const run=generation;$('library-download-status').textContent='Preparazione del download…';
  try{const u=await assetURL(name,type);if(run!==generation)return;const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();$('library-download-status').textContent='Download pronto. Controlla i file scaricati del browser.';}
  catch{if(run===generation)$('library-download-status').textContent='Download non riuscito. Controlla la connessione e riprova.';}
  finally{button.disabled=false;}
 }
 $('library-pdf-save').addEventListener('click',e=>{if(catalog)download('manual.bin','application/pdf',catalog.manual,e.currentTarget);});
 $('library-package').addEventListener('click',e=>{if(catalog)download('package.bin','application/zip',catalog.package,e.currentTarget);});
 let saved;try{saved=sessionStorage.getItem(SESSION);}catch{}
 if(saved)unlock(saved);
 if(location.hash==='#biblioteca')openLibrary();
})();
