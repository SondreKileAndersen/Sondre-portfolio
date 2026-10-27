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
await send('Page.navigate',{url:'http://127.0.0.1:5197/'});
for(let n=0;n<100;n++){if(await evaluate("!!document.querySelector('.navigation-cards')"))break;await sleep(100);}
for(const width of [320,390,760,761,900,1100,1440]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await sleep(300);
 const result=await evaluate(`(()=>{const cards=[...document.querySelectorAll('.navigation-cards__card')];const menu=document.querySelector('.site-header__menu-toggle');return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('.navigation-cards')).gridTemplateColumns,menu:getComputedStyle(menu).display,cardX:cards.map(c=>Math.round(c.getBoundingClientRect().x)),nav:getComputedStyle(document.querySelector('#header-navigation')).display}})()`);
 assert.equal(result.overflow,false);
 const hero=await evaluate(`(()=>{const image=document.querySelector('.hero-portrait img').getBoundingClientRect();const text=document.querySelector('.hero-content').getBoundingClientRect();return {imageWidth:image.width,imageHeight:image.height,imageRight:image.right,imageBottom:image.bottom,textX:text.x,textY:text.y,textHeight:text.height}})()`);
 if(width>760){assert(hero.textX>=hero.imageRight);assert(hero.imageHeight >= hero.textHeight - 1);}else{assert(hero.textY>=hero.imageBottom);}
 if(width<=760){assert.equal(new Set(result.cardX).size,1);assert.equal(result.nav,'none');await evaluate("document.querySelector('.site-header__menu-toggle').click()");await sleep(150);assert.equal(await evaluate("document.querySelector('.site-header__menu-toggle').getAttribute('aria-expanded')"),'true');assert.equal(await evaluate("document.querySelector('#mobile-header-navigation').open"),true);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await sleep(350);assert.equal(await evaluate("document.querySelector('.site-header__menu-toggle').getAttribute('aria-expanded')"),'false');}
 else {assert.equal(result.menu,'none');assert.equal(new Set(result.cardX).size,3);}
 console.log(JSON.stringify(result));
 if(width===390){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(artifactRoot,'home-mobile.png'),Buffer.from(shot.data,'base64'));console.log('Screenshot: '+path.join(artifactRoot,'home-mobile.png'));}
}
await send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});await sleep(150);
const beforeMenu=await evaluate("document.querySelector('main').getBoundingClientRect().height");
await evaluate("document.querySelector('.site-header__menu-toggle').click()");await sleep(120);
const animation=await evaluate(`(()=>{const d=document.querySelector('#mobile-header-navigation');const s=getComputedStyle(d);const b=getComputedStyle(d,'::backdrop');return {transform:s.transform,animation:s.animationName,backdrop:b.animationName,locked:document.body.style.overflow,focusInside:d.contains(document.activeElement),height:document.querySelector('main').getBoundingClientRect().height}})()`);
assert.equal(animation.animation,'mobile-menu-enter');assert.equal(animation.backdrop,'mobile-backdrop-enter');assert.equal(animation.locked,'hidden');assert.equal(animation.focusInside,true);assert.equal(animation.height,beforeMenu);
await sleep(220);
await send('Input.dispatchMouseEvent',{type:'mousePressed',x:10,y:400,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:10,y:400,button:'left',clickCount:1});await sleep(80);
assert.equal(await evaluate("getComputedStyle(document.querySelector('#mobile-header-navigation')).animationName"),'mobile-menu-exit');
await sleep(300);assert.equal(await evaluate("document.querySelector('#mobile-header-navigation').open"),false);assert.equal(await evaluate("document.body.style.overflow"),'');assert.equal(await evaluate("document.activeElement.matches('.site-header__menu-toggle')"),true);
console.log('PASS: animated panel/backdrop, no layout shift, focus containment, outside close and scroll restoration');
console.log('PASS: home layout, portrait sizing, menu, Escape and overflow at 320-1440px');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});








