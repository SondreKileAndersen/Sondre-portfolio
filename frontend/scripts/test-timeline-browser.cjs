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
let activeSection='master-connection-overview';
const evaluate=async expression=>{expression=expression.replace(/document\.querySelector(All)?\((["'])(.*?)\2\)/g,(match,all,quote,selector)=>{if(!/^(\.research-(?!study)|\[data-|dialog\.research-source)/.test(selector))return match;const scoped=selector==='.research-viz'?'#'+activeSection:selector.startsWith('.research-viz ')?'#'+activeSection+selector.slice(13):'#'+activeSection+' '+selector;return 'document.querySelector'+(all||'')+'('+quote+scoped+quote+')'});const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
const wait=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(100)}throw Error('DOM timeout: '+expression)};
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:5197/forskning'});await wait("!!document.querySelector('.research-viz__relation-rows')");
await evaluate('document.fonts.ready');
await sleep(250);
const tableGeometry=()=>evaluate("[...document.querySelectorAll('#master-connection-overview tbody td')].map(cell=>{const r=cell.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})");
const originalGeometry=await tableGeometry();
for(const moment of ['M_FORM','M_PROJ','M_DEV','M_PRESS']) {
 await evaluate(`document.querySelector('#master-connection-overview [data-moment-id=${moment}] th button').click()`);
 await sleep(250);
 assert.equal(await evaluate(`getComputedStyle(document.querySelector('#master-connection-overview [data-moment-id=${moment}] th button')).fontWeight`),'700');
 const selectedGeometry=await tableGeometry();
 assert.equal(selectedGeometry.length,originalGeometry.length);
 selectedGeometry.forEach((cell,index)=>{for(const key of ['x','y','width','height'])assert(Math.abs(cell[key]-originalGeometry[index][key])<.5,`${moment}: table ${key} shifted`)});
}
console.log('PASS: all four moment labels turn bold without moving or resizing table cells');
const photoIntro=await evaluate("(()=>{const section=document.getElementById('photofake'),image=section.querySelector('.split-block__media img').getBoundingClientRect(),copy=section.querySelector('.split-block__content').getBoundingClientRect();return {width:image.width,gap:copy.left-image.right}})()");
assert(photoIntro.width>500);assert(photoIntro.gap>=30&&photoIntro.gap<60);console.log('PASS: PhotoFake image fills left half, copy directly alongside',photoIntro);
const summaryLayout=await evaluate(`(()=>{const root=document.getElementById('master-summary'),left=root.querySelector('.research-study__summary-columns > div:first-child').getBoundingClientRect(),right=root.querySelector('.research-study__summary-columns > div:last-child').getBoundingClientRect(),heading=root.querySelector('header').getBoundingClientRect();return {left:right.left>=left.right,bottom:Math.abs(right.bottom-left.bottom),abstracts:root.querySelectorAll('.research-study__abstracts details').length}})()`);
assert(summaryLayout.left);assert(summaryLayout.bottom<1);assert.equal(summaryLayout.abstracts,2);
assert(await evaluate("(()=>{const strong=document.querySelector('#master-findings > p strong');return !!strong&&strong.textContent.startsWith('et praktisk rammeverk')&&strong.textContent.endsWith('mediekontakt')&&parseInt(getComputedStyle(strong).fontWeight)>=500})()"));
await evaluate("document.querySelector('.research-study__abstracts summary').click()");assert(await evaluate("document.querySelector('.research-study__abstracts details').open"));await evaluate("document.querySelector('.research-study__abstracts summary').click()");
console.log('PASS: premise left, two columns aligned at bottom, two working abstract disclosures');
for (const width of [1440,1024,768,390,320]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
 await sleep(250);
 const result=await evaluate(`(()=>{const root=document.querySelector('.development-timeline'),figure=root.querySelector('.development-timeline__layout'),images=[...root.querySelectorAll('.development-timeline__milestone img')].map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,right:r.right}});return {width:innerWidth,figureWidth:figure.getBoundingClientRect().width,font:getComputedStyle(root.querySelector('h3')).fontSize,transform:getComputedStyle(figure).transform,images,scroll:root.scrollWidth>root.clientWidth,pageScroll:document.documentElement.scrollWidth>innerWidth}})()`);
 console.log(JSON.stringify(result));
 assert.equal(result.transform,'none');assert.equal(result.scroll,false);assert.equal(result.pageScroll,false);
 assert(result.images[0].right<result.images[1].x);assert(result.images[1].right<result.images[2].x);
 assert(Math.abs(result.images[0].y-result.images[2].y)<1);
 if(width===1440){assert(result.figureWidth>=600);assert(parseFloat(result.font)>=16);}
 console.log(JSON.stringify(result));
 if(width===1440){await evaluate("document.querySelector('.development-timeline').scrollIntoView({block:'center',behavior:'instant'})");const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'timeline-desktop.png'),Buffer.from(shot.data,'base64'));}
}
assert.deepEqual(errors,[]);
console.log('PASS: timeline desktop size, horizontal alignment, no scaling or overflow at 320-1440px');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});
