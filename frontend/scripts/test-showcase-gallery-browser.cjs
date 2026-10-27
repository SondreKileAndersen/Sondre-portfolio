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
for(let n=0;n<150;n++){if(await evaluate("!!document.querySelector('#oslomet-teacher-education .split-block__media--strip')"))break;await sleep(100);}
for(const width of [320,390,900,1000]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await sleep(300);
 const g=await evaluate(`(()=>{const section=document.querySelector('#oslomet-teacher-education');const callout=section.querySelector('.split-block__callout').getBoundingClientRect();const images=[...section.querySelectorAll('.split-block__media--strip img')].map(i=>i.getBoundingClientRect());return {left:Math.min(...images.map(i=>i.left)),right:Math.max(...images.map(i=>i.right)),contentLeft:callout.left,contentRight:callout.right}})()`);
 assert(Math.abs(g.left-g.contentLeft)<1);assert(Math.abs(g.right-g.contentRight)<1);console.log(JSON.stringify({width,...g}));
}
console.log('PASS: gallery image edges align with content at 320-1000px');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});
