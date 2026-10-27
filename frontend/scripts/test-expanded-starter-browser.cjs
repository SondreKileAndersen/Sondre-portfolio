const {spawn}=require('node:child_process');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const assert=require('node:assert/strict');
const frontend=path.resolve(__dirname,'..');
const artifactRoot=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-research-checks-'));
const chrome=process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const server=spawn(process.execPath,[path.join(frontend,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','5197'],{cwd:frontend,windowsHide:true,stdio:'ignore'});
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-research-browser-'));
const browser=spawn(chrome,['--headless=new','--no-sandbox','--in-process-gpu','--disable-gpu','--no-first-run','--remote-debugging-port=9337','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let socket;const pending=new Map();let id=0;const errors=[];
async function ready(url){for(let i=0;i<30;i++){try{const r=await fetch(url,{signal:AbortSignal.timeout(700)});if(r.ok)return r}catch{}await sleep(200)}throw Error('Timeout: '+url)}
(async()=>{await ready('http://127.0.0.1:5197');const targets=await (await ready('http://127.0.0.1:9337/json/list')).json();socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r));socket.addEventListener('message',e=>{const message=JSON.parse(e.data);if(message.id){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(message.error):task.resolve(message.result)}else if(message.method==='Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text+': '+message.params.exceptionDetails.exception?.description)});
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}))});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:5197/pedagogikk'});
for(let n=0;n<150;n++){if(await evaluate("!!document.querySelector('[data-starter-card]')"))break;await sleep(100);}
for(const width of [390,600,800]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await sleep(300);
 const count=await evaluate("document.querySelectorAll('[data-starter-card]').length");
 for(let index=0;index<count;index++){
  await evaluate(`document.querySelectorAll('[data-starter-card]')[${index}].querySelector('.teaching-resource-card__toggle').click()`);await sleep(800);
  const g=await evaluate(`(()=>{const e=document.querySelector('.learning-journey__starter-card--expanded');const s=e.closest('section');const c=s.querySelector('.learning-journey-step__copy').getBoundingClientRect();const r=e.getBoundingClientRect();const a=s.querySelector('.learning-journey-step__cta--below-cards')?.getBoundingClientRect();const sr=s.getBoundingClientRect();const st=getComputedStyle(s);return {id:e.dataset.starterCard,top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,copyBottom:c.bottom,ctaTop:a?.top??s.getBoundingClientRect().bottom,safeLeft:sr.left+parseFloat(st.paddingLeft),safeRight:sr.right-parseFloat(st.paddingRight),overflow:document.documentElement.scrollWidth>innerWidth}})()`);
  assert(g.top>=g.copyBottom,JSON.stringify(g));assert(g.ctaTop>=g.bottom,JSON.stringify(g));assert(g.left>=g.safeLeft-1&&g.right<=g.safeRight+1,JSON.stringify(g));assert.equal(g.overflow,false);
  await evaluate("document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))");await sleep(450);assert.equal(await evaluate("!!document.querySelector('.learning-journey__starter-card--expanded')"),false);
 }
 console.log(JSON.stringify({width,checked:count}));
}
console.log('PASS: expanded cards stay in the media area, use available width and close outside');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});

