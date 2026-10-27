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
await send('Page.enable');
for(const [route,width,height] of [['/',900,2200],['/',390,2600],['/pedagogikk',900,1200],['/logistikk',900,1200],['/forskning',900,1200]]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:5197'+route});
 for(let n=0;n<150;n++){if(await evaluate("!!document.querySelector('.site-footer__inner')"))break;await sleep(100);}
 await evaluate('document.fonts.ready.then(()=>true)');await sleep(300);
 const geometry=await evaluate(`(()=>{const footer=document.querySelector('.site-footer').getBoundingClientRect();const inner=document.querySelector('.site-footer__inner').getBoundingClientRect();const main=document.querySelector('main').getBoundingClientRect();return {footerTop:footer.top,footerBottom:footer.bottom,mainBottom:main.bottom,centerDifference:Math.abs((footer.top+footer.bottom-inner.top-inner.bottom)/2),height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth}})()`);
 assert(Math.abs(geometry.footerTop-geometry.mainBottom)<1);
 assert(geometry.footerBottom>=height-1);
 assert(geometry.centerDifference<=3);
 assert.equal(geometry.overflow,false);
 console.log(JSON.stringify({route,width,...geometry}));
}
console.log('PASS: footer starts after content, fills viewport and centers content on all four main pages');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});
