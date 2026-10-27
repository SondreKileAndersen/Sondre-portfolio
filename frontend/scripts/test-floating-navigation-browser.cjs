// Reuse the existing Edge/CDP setup and cleanup for responsive navigation checks.
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'test-home-mobile-browser.cjs'), 'utf8');
const start = source.indexOf('for(const width of');
const end = source.indexOf('})().catch');
const checks = `
for (const width of [390, 760, 761, 1440]) {
 await send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: false});
 await evaluate('window.scrollTo({top: 0, behavior: "instant"})'); await sleep(350);
 assert.equal(await evaluate('!!document.querySelector(".floating-menu-toggle")'), false);
 assert.equal(await evaluate('!!document.querySelector(".back-to-top")'), false);
 await evaluate('window.scrollTo({top: 650, behavior: "instant"})'); await sleep(250);
 assert.equal(await evaluate('!!document.querySelector(".floating-menu-toggle")'), false);
 assert.equal(await evaluate('!!document.querySelector(".back-to-top")'), true);
 if (width <= 760) {
   assert.equal(await evaluate('getComputedStyle(document.querySelector(".back-to-top")).display'), 'none');
   console.log('PASS: no floating controls visible on mobile at ' + width + 'px');
   continue;
 }
 assert.equal(await evaluate('getComputedStyle(document.querySelector(".back-to-top")).display'), 'grid');
 await evaluate('document.querySelector(".back-to-top").click()'); await sleep(80);
 assert.equal(await evaluate('document.querySelector(".back-to-top").classList.contains("back-to-top--leaving")'), true);
 assert.equal(await evaluate('getComputedStyle(document.querySelector(".back-to-top")).animationName'), 'back-to-top-disappear');
 await sleep(1000);
 assert.equal(await evaluate('window.scrollY'), 0);
 assert.equal(await evaluate('!!document.querySelector(".back-to-top")'), false);
 assert.equal(await evaluate('!!document.querySelector(".floating-menu-toggle")'), false);
 console.log('PASS: desktop back-to-top without floating hamburger at ' + width + 'px');
}
assert.deepEqual(errors, []);
`;
eval(source.slice(0, start) + checks + source.slice(end));
