// Prova de browser (Chrome real) do gesto: arraste um Slider e clique um
// ReconfigButton. Despacha MouseEvent bubbling reais no DOM vivo e lê o
// resultado do re-render — o caminho que o `kof test --target js` headless
// não exercita (lá os handlers nunca disparam). Requer Chrome (ver
// scripts/browser-session.mjs). Uso:
//   scripts/export-example.sh slider && node scripts/browser-drag.mjs
// Node 18 não expõe WebSocket global; o navegador-alvo é real via CDP, então
// basta um shim (ws) p/ o cliente de debugging. Node >= 22 ignora o shim.
import {createRequire} from 'node:module';
if (typeof globalThis.WebSocket === 'undefined') {
    const require = createRequire(import.meta.url);
    try {
        const {WebSocket} = require(process.env.UIW_WS || '../.build/ws-shim/node_modules/ws');
        globalThis.WebSocket = WebSocket;
    } catch { /* deixa falhar no openBrowser se nem assim houver WebSocket */ }
}
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {openBrowser} from './browser-session.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await openBrowser();
try {
    await browser.load(path.join(root, '.build/web/slider/index.html'));
    // Espera o KofJS montar a janela (kof-root preenchido pelo main()).
    await browser.evaluate(`(() => new Promise(res => {
        const t = setInterval(() => {
            if (document.querySelector('.kof-component') && document.querySelector('.kof-button')) {
                clearInterval(t); res(true);
            }
        }, 20);
        setTimeout(() => { clearInterval(t); res(false); }, 8000);
    }))()`);

    // O valor é o único kof-label de inteiro puro (título/descrição têm texto,
    // a barra tem glifos). Lê por regex, não por posição.
    const sliderText = `(() => {
        const c = document.querySelector('.kof-component');
        const labels = [...c.querySelectorAll('.kof-label')].map(n => n.textContent.trim());
        return labels.find(t => /^-?\\d+$/.test(t)) || ('NA:' + labels.join('|'));
    })()`;
    const before = await browser.evaluate(sliderText);
    assert.equal(before, '20', `slider começa em 20, veio ${JSON.stringify(before)}`);

    // Arraste real: mousedown em clientX=100 -> mousemove +40px -> mouseup.
    // ancora=20, 40px / 4px-por-passo = +10 unidades * passo 5 = 70.
    await browser.evaluate(`(() => {
        const c = document.querySelector('.kof-component');
        const fire = (type, x) => c.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, clientX: x, clientY: 0}));
        fire('mousedown', 100);
        fire('mousemove', 140);
        fire('mouseup', 140);
        return true;
    })()`);
    const afterDrag = await browser.evaluate(sliderText);
    assert.equal(afterDrag, '70', `arrastar +40px deve levar 20 a 70, veio ${JSON.stringify(afterDrag)}`);
    assert.notEqual(afterDrag, before, 'o re-render deve ter mudado o DOM');

    // Clique real no ReconfigButton: troca o próprio rótulo pós-criação.
    const buttonText = `document.getElementById('reconfig-1').textContent`;
    const btnBefore = await browser.evaluate(buttonText);
    await browser.evaluate(`(() => { document.getElementById('reconfig-1').dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true})); return true; })()`);
    const btnAfter = await browser.evaluate(buttonText);
    assert.equal(btnBefore, 'desligado', `começa desligado, veio ${JSON.stringify(btnBefore)}`);
    assert.equal(btnAfter, 'LIGADO', `um clique deve ligar, veio ${JSON.stringify(btnAfter)}`);

    // Segundo clique volta a desligar.
    await browser.evaluate(`(() => { document.getElementById('reconfig-1').dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true})); return true; })()`);
    assert.equal(await browser.evaluate(buttonText), 'desligado', 'segundo clique desliga');

    assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
    console.log(`Chrome: slider ${before} -> ${afterDrag} (drag +40px); ReconfigButton ${btnBefore} -> ${btnAfter} -> ${await browser.evaluate(buttonText)} (2 cliques). Drag & vinculo pos-criacao provados no DOM real.`);
} finally {
    await browser.close();
}
