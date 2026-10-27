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
await send('Page.enable');await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:'http://127.0.0.1:5197/logistikk'});
for(let n=0;n<150;n++){if(await evaluate("!!document.querySelector('.principles-block')"))break;await sleep(100);}
await evaluate('document.fonts.ready.then(()=>true)');
for(const width of [320,390,500,600,900,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1200,deviceScaleFactor:1,mobile:false});await sleep(450);
 const g=await evaluate(`(()=>{const s=document.querySelector('.principles-block');const r=s.getBoundingClientRect();const header=s.querySelector('header').getBoundingClientRect();const title=s.querySelector('h2').getBoundingClientRect();const portrait=s.querySelector('.principles-block__portrait').getBoundingClientRect();const items=[...s.querySelectorAll('.principles-block__items li')].map(li=>{const icon=li.querySelector('svg').getBoundingClientRect();const copy=li.querySelector('.principles-block__feature-copy').getBoundingClientRect();return {x:icon.x,center:icon.x+icon.width/2,copyX:copy.x,copyRight:copy.right}});return {x:r.x,y:r.y,width:r.width,height:r.height,titleY:title.y,portraitBottom:portrait.bottom,items,path:s.querySelector('.principles-block__path path[stroke="currentColor"]').getAttribute('d'),overflow:document.documentElement.scrollWidth>innerWidth}})()`);
 assert.equal(g.overflow,false);
 if(width<=900){assert(g.titleY>=g.portraitBottom);assert(g.items[0].center<g.items[1].center);assert(Math.abs(g.items[0].center-g.items[2].center)<1);}
 console.log(JSON.stringify({width,height:g.height,items:g.items}));
 if(width===500){const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:g.y,width:500,height:g.height,scale:1}});fs.writeFileSync(path.join(artifactRoot,'principles-mobile.png'),Buffer.from(screenshot.data,'base64'));console.log('Screenshot: '+path.join(artifactRoot,'principles-mobile.png'));}
}
console.log('PASS: alternating mobile principles flow and desktop layout without overflow');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});

