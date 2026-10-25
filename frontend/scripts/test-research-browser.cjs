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
let activeSection='master-visualizations';
const evaluate=async expression=>{expression=expression.replace(/document\.querySelector(All)?\((["'])(.*?)\2\)/g,(match,all,quote,selector)=>{if(!/^(\.research-(?!study)|\[data-|dialog\.research-source)/.test(selector))return match;const scoped=selector==='.research-viz'?'#'+activeSection:selector.startsWith('.research-viz ')?'#'+activeSection+selector.slice(13):'#'+activeSection+' '+selector;return 'document.querySelector'+(all||'')+'('+quote+scoped+quote+')'});const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
const wait=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(100)}throw Error('DOM timeout: '+expression)};
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:5197/forskning'});await wait("!!document.querySelector('.research-viz__concept-model')");
assert.equal(await evaluate("document.querySelectorAll('.research-study__part').length"),4);

assert(await evaluate("(()=>{const section=document.getElementById('master-connection-overview');return !!section&&section.parentElement!==document.getElementById('master-visualizations').parentElement.querySelector('.research-viz__plot')&&!section.querySelector('.research-viz__tabs')&&section.querySelector('h2').textContent==='Koblingsoversikt'})()"));
assert(!await evaluate("[...document.getElementById('master-visualizations').querySelectorAll('.research-viz__tabs button')].some(button=>button.textContent==='Koblingsoversikt')"));
const clickButton=async text=>{if(text==='Koblingsoversikt'){activeSection='master-connection-overview';await evaluate("document.getElementById('master-connection-overview').scrollIntoView({behavior:'instant'})");await sleep(100);return}if(text==='Nettverk'){activeSection='master-visualizations';await evaluate("document.getElementById('master-visualizations').scrollIntoView({behavior:'instant'})");await sleep(100);return}await evaluate(`(()=>{const b=[...document.querySelectorAll('.research-viz button')].find(b=>b.textContent===${JSON.stringify(text)});if(!b)throw Error('Missing button '+${JSON.stringify(text)});b.click()})()`);await sleep(100)};
await clickButton('Paratekster og vurderingsmomenter');await wait("!!document.querySelector('.research-viz__network')");

await evaluate("document.querySelector('.research-viz__network').scrollIntoView({behavior:'instant'})");await sleep(100);
const geometry=await evaluate("(()=>{const node=document.querySelector('[data-node-id=P_EMAIL]'),rect=node.querySelector('rect').getBoundingClientRect(),svg=node.closest('svg');return {x:rect.x+rect.width/2,y:rect.y+rect.height/2,transform:node.getAttribute('transform'),path:document.querySelector('[data-pair-id^=P_EMAIL] .research-viz__edge').getAttribute('d'),width:parseFloat(node.querySelector('rect').getAttribute('width')),textWidth:node.querySelector('text').getBBox().width,labelFont:getComputedStyle(node.querySelector('text')).fontSize,bodyFont:getComputedStyle(document.querySelector('.research-viz__figure>p')).fontSize,scale:svg.getBoundingClientRect().width/svg.viewBox.baseVal.width}})()");
assert.equal(geometry.labelFont,geometry.bodyFont);assert(Math.abs(geometry.scale-1)<.01);assert(Math.abs(geometry.width-geometry.textWidth-28)<2);
await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,x:geometry.x,y:geometry.y});
await send('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,x:geometry.x+95,y:geometry.y+45});
await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,x:geometry.x+95,y:geometry.y+45});await sleep(100);
const movedTransform=await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')");assert.notEqual(movedTransform,geometry.transform);
assert.notEqual(await evaluate("document.querySelector('[data-pair-id^=P_EMAIL] .research-viz__edge').getAttribute('d')"),geometry.path);
assert(!await evaluate("!!document.querySelector('dialog.research-source')"));
await evaluate("document.querySelector('[data-node-id=P_EMAIL]').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await sleep(50);
assert.notEqual(await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')"),movedTransform);
const styles=await evaluate("(()=>{const node=document.querySelector('[data-node-id=M_FORM] rect'),edge=document.querySelector('[data-pair-id$=M_FORM] .research-viz__edge--direct'),dash=document.querySelector('.research-viz__edge--analytical');return {fill:getComputedStyle(node).fill,stroke:getComputedStyle(edge).stroke,dashWidth:parseFloat(getComputedStyle(dash).strokeWidth),directWidth:parseFloat(getComputedStyle(edge).strokeWidth),dashOpacity:parseFloat(getComputedStyle(dash).opacity)}})()");
assert.equal(styles.fill,'rgb(112, 198, 183)');assert.equal(styles.stroke,styles.fill);assert(styles.dashWidth<styles.directWidth);assert(styles.dashOpacity<1);

const expectedColors={M_DEV:'rgb(67, 127, 153)',M_FORM:'rgb(112, 198, 183)',M_PRESS:'rgb(236, 197, 175)',M_PROJ:'rgb(209, 102, 94)'};
for(const [moment,color] of Object.entries(expectedColors))assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-node-id=${moment}] rect')).fill`),color);
const preserved=await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')");
await clickButton('Koblingsoversikt');await clickButton('Nettverk');assert.equal(await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')"),preserved);
const touchOrigin=await evaluate("(()=>{document.querySelector('.research-viz__network').scrollIntoView({behavior:'instant'});const r=document.querySelector('[data-node-id=P_EMAIL] rect').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchOrigin.x,y:touchOrigin.y,id:1}]});
await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchOrigin.x+40,y:touchOrigin.y+20,id:1}]});
await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(80);
assert.notEqual(await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')"),preserved);assert(!await evaluate("!!document.querySelector('dialog.research-source')"));
await clickButton('Tilbakestill plassering');assert.equal(await evaluate("document.querySelector('[data-node-id=P_EMAIL]').getAttribute('transform')"),geometry.transform);
console.log('PASS: touch drag, all four exact colors, persistent positions across views and layout reset');

console.log('PASS: pointer drag and keyboard movement, attached edges, click suppression, compact boxes, body-size labels and moment colors');

await evaluate("[...document.querySelectorAll('.research-viz__filters label')].find(l=>l.textContent==='Inkluder ekspert Z').querySelector('input').click()");await sleep(100);
for(let mask=0;mask<8;mask++){
 await evaluate(`(()=>{const inputs=[...document.querySelectorAll('.research-viz__filters fieldset:first-of-type input')];inputs.forEach((input,i)=>{if(input.checked!==!!(${mask}&(1<<i)))input.click()})})()`);await sleep(100);
 const count=await evaluate("document.querySelector('.research-viz__figure [aria-live]').textContent");assert.equal(parseInt(count),[0,37,32,69,3,40,35,72][mask]);
 if(mask===0)assert(await evaluate("!!document.querySelector('.research-viz__empty')"));
}
assert(!await evaluate("[...document.querySelectorAll('.research-viz button')].some(button=>button.textContent==='Originalmatrise')"));
assert(!await evaluate("!!document.querySelector('.research-source')"));
await evaluate("document.querySelector('.research-viz__network [role=button]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))");
const scrollBeforePanel=await evaluate('scrollY');
await evaluate("(()=>{const slot=document.getElementById('master-visualizations').querySelector('.research-viz__source-slot');scrollTo(0,slot.getBoundingClientRect().top+scrollY+100)})()");await sleep(100);
assert(await evaluate("(()=>{const panel=document.getElementById('master-visualizations').querySelector('.research-source'),slot=panel.parentElement;return getComputedStyle(panel).position==='absolute'&&Math.abs(panel.getBoundingClientRect().top-slot.getBoundingClientRect().top)<2})()"));
await evaluate('scrollTo(0,'+scrollBeforePanel+')');await sleep(100);
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
assert(!await evaluate("!!document.querySelector('.research-source')"));
console.log('PASS: selected source panel stays attached to its figure during page scrolling');
await clickButton('Koblingsoversikt');
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows tbody tr').length"),4);
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows thead th').length"),7);
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows tbody td').length"),24);
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows [data-connection-status=clear] .research-viz__dot--active').length"),10);
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows [data-connection-status=possible] .research-viz__dot--possible').length"),5);
assert.equal(await evaluate("document.querySelectorAll('.research-viz__relation-rows [data-connection-status=none]:empty').length"),9);
assert.equal(await evaluate("document.querySelector('[data-moment-id=M_PRESS] [data-source-id=P_EMAIL]').dataset.connectionStatus"),'possible');
assert.equal(await evaluate("document.querySelector('[data-moment-id=M_FORM] [data-source-id=P_EMAIL]').dataset.rowConnection"),'start');
assert.equal(await evaluate("document.querySelector('[data-moment-id=M_FORM] [data-source-id=P_STEAM]').dataset.rowConnection"),'end');
assert.equal(await evaluate("document.querySelector('[data-moment-id=M_FORM] [data-source-id=P_PRESSKIT]').dataset.rowConnection"),undefined);
const ring=await evaluate("(()=>{const dot=document.querySelector('.research-viz__relation-rows .research-viz__dot--possible'),style=getComputedStyle(dot);return {background:style.backgroundColor,surface:getComputedStyle(document.querySelector('.research-viz')).backgroundColor,border:style.borderTopWidth}})()");assert.equal(ring.background,ring.surface);assert.equal(ring.border,'2px');
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows [data-row-connection]')].every(cell=>{const dot=cell.querySelector('.research-viz__dot');if(!dot)return true;const r=cell.getBoundingClientRect(),d=dot.getBoundingClientRect();return Math.abs(r.y+r.height/2-d.y-d.height/2)<2&&Math.abs(r.x+r.width/2-d.x-d.width/2)<2})"));


await evaluate("document.querySelector('.research-viz__relation-rows').scrollIntoView({behavior:'instant',block:'center'})");
await evaluate("document.querySelector('[data-moment-id=M_DEV] [data-source-id=P_STEAM] button').click()");
assert(!await evaluate("!!document.getElementById('master-connection-overview').querySelector('.research-viz__interaction-guide')"));
await wait("!!document.querySelector('.research-source:not(.research-source--empty)')");
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");await wait("!document.querySelector('.research-source:not(.research-source--empty)')");
await evaluate("document.querySelector('[data-moment-id=M_DEV] [data-source-id=P_ACTIVITY] button').click()");await wait("!!document.querySelector('.research-source:not(.research-source--empty)')");
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");await wait("!document.querySelector('.research-source:not(.research-source--empty)')");
assert(!await evaluate("/REL-|OBS-|Proveniens:|Kildestatus:|Revidert analysematrise|Analytisk memo/.test(document.querySelector('.research-source')?.textContent ?? '')"));
await evaluate("document.querySelector('[data-source-heading=P_EMAIL] button').click()");
await wait("!!document.querySelector('.research-source__assessment')");
assert(await evaluate("(()=>{const panel=document.getElementById('master-connection-overview'),body=panel.querySelector('.research-source__content'),heading=panel.querySelector('.research-source__assessment'),top=heading.getBoundingClientRect().top;body.scrollTop=80;const pinned=Math.abs(heading.getBoundingClientRect().top-top)<2;body.scrollTop=0;return getComputedStyle(heading).position==='sticky'&&pinned})()"));

assert(await evaluate("(()=>{const body=document.querySelector('.research-source__content');body.style.maxHeight='100px';body.scrollTop=100;const scrolls=body.scrollHeight>body.clientHeight&&body.scrollTop>0;body.style.maxHeight='';return scrolls})()"));
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
console.log('PASS: simplified contextual source panel');
const curated=JSON.parse(fs.readFileSync(path.join(frontend,'src/data/research-visualization/data/infobokser_evidens.json'),'utf8'));
const momentKeys={M_FORM:'formidlingsrammer',M_PROJ:'prosjektgrunnlag',M_DEV:'utviklergrunnlag',M_PRESS:'pressemateriale'},sourceKeys={P_EMAIL:'epost',P_TRAILER:'trailer',P_STEAM:'steam',P_DEVELOPERWEB:'developer_site',P_ACTIVITY:'activity',P_PRESSKIT:'presskit'};
for(const [moment,momentKey] of Object.entries(momentKeys))for(const [source,sourceKey] of Object.entries(sourceKeys)){
 const cell=curated.cells.find(cell=>cell.id===momentKey+'__'+sourceKey);
 if(cell.classification==='none'||![...cell.primaryCodes,...cell.contextCodes].some(code=>code.informant!=='Z'&&code.text.trim())){assert(!await evaluate("!!document.querySelector('[data-moment-id="+moment+"] [data-source-id="+source+"] button')"));continue;}
 await evaluate("document.querySelector('[data-moment-id="+moment+"] [data-source-id="+source+"] button').click()");
 const rendered=await evaluate("(()=>{const panel=document.getElementById('master-connection-overview').querySelector('.research-source'),cell=panel.querySelector('[data-evidence-cell]');return {id:cell.dataset.evidenceCell,text:cell.textContent,primary:cell.querySelectorAll('li[data-evidence-role=direct_or_nearest]').length,context:!!cell.querySelector('li[data-evidence-role=contextual_not_cell_direct]')}})()");
 assert(await evaluate("[...document.getElementById('master-connection-overview').querySelectorAll('.research-source__record li p')].every(p=>{const text=p.textContent;return text[0]===text[0].toLocaleUpperCase('nb')&&/[.!?\u2026]$/.test(text)})"));
 assert(await evaluate("(()=>{const records=[...document.getElementById('master-connection-overview').querySelectorAll('[data-evidence-cell] > .research-source__record > strong')].map(node=>node.textContent);return new Set(records).size===records.length})()"));
 assert.equal(rendered.id,cell.id);assert.equal(rendered.primary,new Set(cell.primaryCodes.filter(code=>code.informant!=='Z').map(code=>code.informant+'|'+code.text.trim().toLocaleLowerCase('nb'))).size);assert.equal(rendered.context,cell.contextCodes.some(code=>code.informant!=='Z'));assert(!rendered.text.includes(cell.interpretiveWarning));
 assert(!rendered.text.includes('B5-'));assert(!rendered.text.includes('Praktisk analyse / avgrensning'));
}
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
assert(!await evaluate("!!document.querySelector('.research-viz__filters')"));
await evaluate("document.querySelector('[data-moment-id=M_PROJ] [data-source-id=P_TRAILER] button').click()");
const clickedTitle=await evaluate("document.querySelector('.research-source__content').textContent");
await evaluate("document.querySelector('[data-source-heading=P_EMAIL] button').dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse'}));document.querySelector('[data-source-heading=P_EMAIL] button').focus()");
assert.equal(await evaluate("document.querySelector('.research-source__content').textContent"),clickedTitle);
assert(await evaluate("(()=>{const button=document.querySelector('[data-moment-id=M_PROJ] [data-source-id=P_TRAILER] button'),ring=getComputedStyle(button.querySelector('.research-viz__dot'),'::after');return button.getAttribute('aria-pressed')==='true'&&ring.borderTopColor==='rgb(0, 0, 0)'&&parseFloat(ring.top)<0})()"));
await evaluate("document.querySelector('[data-moment-id=M_FORM] th button').click()");
assert(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_FORM] th button')).fontWeight==='700'&&getComputedStyle(document.querySelector('[data-moment-id=M_PROJ] th button')).fontWeight!=='700'"));
await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
await evaluate("document.querySelector('[data-source-heading=P_EMAIL] button').dispatchEvent(new PointerEvent('pointerout',{bubbles:true,pointerType:'mouse'}));document.activeElement.blur()");
console.log('PASS: 28 curated cells, simplified panels, click-only selection, active text and black point ring');

const fixedOrder=['P_EMAIL','P_STEAM','P_TRAILER','P_DEVELOPERWEB','P_ACTIVITY','P_PRESSKIT'];
assert.deepEqual(await evaluate("[...document.querySelectorAll('[data-source-heading]')].map(cell=>cell.dataset.sourceHeading)"),fixedOrder);
await evaluate("document.querySelector('[data-source-heading=P_EMAIL] button').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',altKey:true,bubbles:true}))");
assert.deepEqual(await evaluate("[...document.querySelectorAll('[data-source-heading]')].map(cell=>cell.dataset.sourceHeading)"),fixedOrder);
assert(await evaluate("(()=>{const legend=document.getElementById('master-connection-overview').querySelector('.research-viz__legend--compact'),items=legend.querySelectorAll('li');return getComputedStyle(legend).flexDirection==='row'&&Math.abs(items[0].getBoundingClientRect().top-items[1].getBoundingClientRect().top)<2})()"));
console.log('PASS: fixed reference order, no keyboard reordering, compact footer and vertically centered legend');
assert(await evaluate("(()=>{const table=document.querySelector('.research-viz__relation-rows'),footer=table.querySelector('thead'),body=table.querySelector('tbody'),button=footer.querySelector('button');return footer.getBoundingClientRect().bottom<=body.getBoundingClientRect().top+1&&new DOMMatrixReadOnly(getComputedStyle(button).transform).b<0})()"));
const sourceLabels=await evaluate("[...document.querySelectorAll('.research-viz__relation-rows thead th button')].map(button=>button.textContent.replaceAll('\u00ad',''))");
assert.deepEqual(sourceLabels,['Direkte kontakt (E-post)','Steam-side','Trailer','Ekstern info om utvikler*','Synlig aktivitet på utvikling','Pressepakke']);
assert.deepEqual(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows tbody th button')].map(button=>button.textContent)"),['Formidlingsrammer','Prosjektgrunnlag','Utviklergrunnlag','Pressemateriale']);

async function hoverSource(source){const point=await evaluate(`(()=>{const button=document.querySelector('[data-source-heading=${source}] button');button.scrollIntoView({behavior:'instant',block:'center'});const r=button.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});await sleep(200)}
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:2});await sleep(200);
const bodyBeforeActivityHover=await evaluate("document.querySelector('.research-viz__relation-rows tbody').getBoundingClientRect().top+scrollY");
await hoverSource('P_ACTIVITY');
const bodyAfterActivityHover=await evaluate("document.querySelector('.research-viz__relation-rows tbody').getBoundingClientRect().top+scrollY");
assert(Math.abs(bodyBeforeActivityHover-bodyAfterActivityHover)<1);
await hoverSource('P_EMAIL');
assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_FORM]')).opacity"),'1');
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_PRESS]')).opacity"))<.1);
await hoverSource('P_DEVELOPERWEB');
assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_DEV]')).opacity"),'1');
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_PROJ]')).opacity"))<.1);
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-moment-id=M_FORM]')).opacity"))<.1);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:2});await sleep(200);
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows tbody tr')].every(row=>getComputedStyle(row).opacity==='1')"));
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows thead th button')].every(button=>getComputedStyle(button).borderTopWidth==='0px'&&getComputedStyle(button).backgroundColor==='rgba(0, 0, 0, 0)')"));
console.log('PASS: plain text labels; hovering a source dims only non-clear moment rows including text; pointer leave restores all rows');
async function hoverMoment(moment){const point=await evaluate(`(()=>{const button=document.querySelector('[data-moment-id=${moment}] th button');button.scrollIntoView({behavior:'instant',block:'center'});const r=button.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});await sleep(200)}
await hoverMoment('M_FORM');
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows tbody tr:not([data-moment-id=M_FORM])')].every(row=>Number(getComputedStyle(row).opacity)<.1)"));
assert(await evaluate("(()=>{const cell=document.querySelector('[data-moment-id=M_FORM] [data-source-id=P_TRAILER]');return getComputedStyle(cell).opacity==='1'&&Number(getComputedStyle(cell.querySelector('button')).opacity)<.1&&!cell.hasAttribute('data-row-connection')})()"));

assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_EMAIL]')).opacity"),'1');
assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_STEAM]')).opacity"),'1');
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_TRAILER]')).opacity"))<.1);
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows [data-source-id=P_TRAILER]')].every(cell=>!cell.firstElementChild||Number(getComputedStyle(cell.firstElementChild).opacity)<.1)"));
await hoverMoment('M_DEV');
assert(await evaluate("(()=>{const cell=document.querySelector('[data-moment-id=M_DEV] [data-source-id=P_STEAM]');return getComputedStyle(cell,'::before').zIndex==='2'&&cell.hasAttribute('data-row-connection')&&Number(getComputedStyle(cell.querySelector('button')).opacity)<.1})()"));
await hoverMoment('M_PRESS');
assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_TRAILER]')).opacity"),'1');
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_EMAIL]')).opacity"))<.1);
assert(Number(await evaluate("getComputedStyle(document.querySelector('[data-source-heading=P_DEVELOPERWEB]')).opacity"))<.1);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:2});await sleep(200);
assert(await evaluate("[...document.querySelectorAll('.research-viz__relation-rows th,.research-viz__relation-rows td')].every(cell=>getComputedStyle(cell).opacity==='1')"));
console.log('PASS: moment hover dims non-clear source columns, including headers/markers/lines, and restores on leave');

await evaluate("document.querySelector('.research-viz__relation-rows thead th button').click()");await wait("!!document.querySelector('.research-source:not(.research-source--empty)')");
assert(await evaluate("(()=>{const plot=document.querySelector('.research-viz__plot').getBoundingClientRect(),panel=document.querySelector('.research-source').getBoundingClientRect(),body=document.querySelector('.research-viz__relation-rows tbody').getBoundingClientRect(),legend=document.querySelector('.research-viz__annotations > p:last-child').getBoundingClientRect();return panel.left>=plot.right&&Math.abs(panel.top-body.top)<2&&Math.abs(panel.bottom-legend.bottom)<2})()"));
assert.equal(await evaluate("getComputedStyle(document.querySelector('.research-source__content')).overflowY"),'auto');
assert(await evaluate("(()=>{const root=document.getElementById('master-connection-overview'),intro=root.querySelector('.research-source__assessment');return !!intro&&!root.querySelector('.research-source__header')&&getComputedStyle(intro.querySelector('strong')).fontWeight==='700'&&!intro.textContent.includes('Indirekte / betinget')})()"));
assert(await evaluate("document.querySelector('.research-source').textContent.includes('Informant ')") );
assert(!await evaluate("/REL-|OBS-|Proveniens:|Kildestatus:|extracted_not_independently_verified/.test(document.querySelector('.research-source').textContent)"));

await evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");await wait("!document.querySelector('.research-source:not(.research-source--empty)')");
await evaluate("document.querySelector('.research-viz__relation-rows').scrollIntoView({behavior:'instant'})");const rowShot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-connection-rows.png'),Buffer.from(rowShot.data,'base64'));
assert(await evaluate("(()=>{const root=document.getElementById('master-connection-overview'),scroll=root.querySelector('.research-viz__plot > .research-viz__scroll'),table=root.querySelector('.research-viz__relation-rows'),plot=root.querySelector('.research-viz__plot');return getComputedStyle(scroll).overflowX==='visible'&&table.getBoundingClientRect().width<=plot.getBoundingClientRect().width+1})()"));
await evaluate("document.querySelector('.research-viz__relation-rows').scrollIntoView({behavior:'instant',block:'center'})");
const overviewShot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-overview-labels.png'),Buffer.from(overviewShot.data,'base64'));
console.log('PASS: swapped axes (7 paratext columns, 4 moment rows), 10 colored/5 hollow/13 empty cells, horizontal connectors and source inspection');
await clickButton('Nettverk');await evaluate("document.querySelector('.research-viz__network [role=button]').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))");await wait("!!document.querySelector('.research-source:not(.research-source--empty)')");assert(!await evaluate("/REL-|OBS-|Kildestatus:/.test(document.querySelector('.research-source').textContent)"));assert(!await evaluate("!!document.querySelector('.research-source a')"));await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait("!document.querySelector('.research-source:not(.research-source--empty)')");
await clickButton('Variasjon mellom spillformidlere');assert.equal(await evaluate("document.querySelectorAll('.research-viz__table tbody tr').length"),10);assert.equal(await evaluate("document.querySelectorAll('.research-viz__table tbody td').length"),50);
assert(await evaluate("document.querySelector('.research-viz__table').textContent.includes('Diskvalifiserer ikke i seg selv')"));
await clickButton('Fra første kontakt til mulig omtale');assert(await evaluate("!!document.querySelector('.research-viz__process')"));
await sleep(100);
assert(await evaluate("[...document.querySelectorAll('.research-viz__process [data-node-description]')].every(node=>node.scrollWidth<=Number(node.parentElement.getAttribute('width'))+1&&node.scrollHeight<=Number(node.parentElement.getAttribute('height'))+1)"));
await evaluate("document.querySelector('.research-viz__process').scrollIntoView({behavior:'instant'});document.querySelector('.research-viz__process [data-node-id]').focus()");
const processBefore=await evaluate("document.querySelector('.research-viz__process .research-viz__edge').getAttribute('d')");
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await sleep(60);
assert.notEqual(await evaluate("document.querySelector('.research-viz__process .research-viz__edge').getAttribute('d')"),processBefore);
const processShot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-process.png'),Buffer.from(processShot.data,'base64'));
console.log('PASS: compact process labels without clipping and connected process-node movement');

await evaluate("[...document.querySelectorAll('.research-viz__filters fieldset:first-of-type label')].find(l=>l.textContent==='Analytisk utledede').querySelector('input').click()");await sleep(100);assert(await evaluate("!!document.querySelector('.research-viz__empty')"));
await clickButton('Paratekster og vurderingsmomenter');await evaluate("(()=>{const s=document.querySelector('.research-viz__filters select');s.value='A';s.dispatchEvent(new Event('change',{bubbles:true}))})()");await sleep(100);assert(await evaluate("document.querySelector('.research-viz').textContent.includes('Tverrgående analyse er skjult')"));
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await evaluate("document.querySelector('.research-viz__figure').scrollIntoView({behavior:'instant'})");await sleep(200);
const widths=await evaluate("({window:innerWidth,page:document.documentElement.scrollWidth,visualization:document.querySelector('.research-viz').getBoundingClientRect().width})");console.log('Mobile widths',JSON.stringify(widths));assert(widths.visualization<=390);assert(widths.page<=390);
assert(!await evaluate("!!document.querySelector('.research-viz__exports')"));
console.log('PASS: export controls removed');console.log('Browser artifacts: '+artifactRoot);
const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-mobile.png'),Buffer.from(shot.data,'base64'));
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await evaluate("document.querySelector('.research-viz__figure').scrollIntoView({behavior:'instant'})");await sleep(100);const desktop=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-desktop.png'),Buffer.from(desktop.data,'base64'));
const responsive=[];
for(const width of [1440,1280,1100,880,390,320]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<600});await sleep(150);
 responsive.push(await evaluate("(()=>{const root=document.getElementById('master-connection-overview'),stage=root.querySelector('.research-viz__stage'),plot=root.querySelector('.research-viz__plot').getBoundingClientRect(),source=root.querySelector('.research-viz__source-slot').getBoundingClientRect(),annotations=root.querySelector('.research-viz__annotations').getBoundingClientRect();return {width:innerWidth,page:document.documentElement.scrollWidth,layout:stage.dataset.layout,figure:plot.width,source:source.width,sourceAboveLegend:source.bottom<=annotations.top+1,sourceBelowFigure:source.top>=plot.bottom-1}})()"));
}
assert(Math.abs(responsive[0].figure-responsive[1].figure)<2);assert(responsive[1].source<responsive[0].source);
assert(responsive[2].figure<responsive[1].figure&&responsive[2].source>=320);
for(const item of responsive.slice(3)){assert.equal(item.layout,'stacked');assert(item.sourceAboveLegend&&item.sourceBelowFigure);assert(item.page<=item.width);}
console.log('PASS: source shrinks first, then figure; minimums trigger source above inline legend; 320-1440px without page overflow');
await send('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});
await evaluate("document.getElementById('master-connection-overview').querySelector('.research-viz__source-slot').scrollIntoView({behavior:'instant',block:'center'})");await sleep(150);
const stackedShot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(artifactRoot,'research-overview-stacked.png'),Buffer.from(stackedShot.data,'base64'));

assert.deepEqual(errors,[]);console.log('PASS: browser interaction, all 8 toggle combinations, 28 matrix cells, 50 comparison cells, keyboard source dialog, process empty state, individual filter, desktop/mobile without page overflow, no runtime exceptions');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{socket?.close();browser.kill();server.kill()});
