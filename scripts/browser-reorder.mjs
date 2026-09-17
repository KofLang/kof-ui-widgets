// Prova de browser (Chrome real) do gesto de REORDEM: arraste a linha 0
// para baixo e verifique a ordem re-renderizada no DOM vivo. É o caminho
// headless (kof test --target js) que NÃO exercita: lá os handlers de
// ponteiro nunca disparam (stateSet é browser-only). Reusa o MESMO
// mecanismo de ponteiro do Slider (UIW005) — agora no eixo Y (Event.y()).
// As linhas têm id estável `reorder-<id>-<posição>` e o texto é a etiqueta
// na posição, então ler por id == ler a ordem corrente.
//
//   scripts/export-example.sh reorder && node scripts/browser-reorder.mjs
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
    await browser.load(path.join(root, '.build/web/reorder/index.html'));
    await browser.evaluate(`(() => new Promise(res => {
        const t = setInterval(() => {
            if (document.getElementById('reorder-1-0') && document.getElementById('reorder-1-2')) {
                clearInterval(t); res(true);
            }
        }, 20);
        setTimeout(() => { clearInterval(t); res(false); }, 8000);
    }))()`);

    const readOrder = `(() => {
        const p = [...Array(3).keys()].map(i => (document.getElementById('reorder-1-' + i) || {}).textContent || 'NA');
        return p.join('|');
    })()`;
    const before = await browser.evaluate(readOrder);
    assert.match(before, /^1\. escrever docs/, `começa com 'escrever docs' na linha 0, veio ${JSON.stringify(before)}`);

    // Arraste real da linha 0 para 2 linhas abaixo: mousedown em clientY=200,
    // mousemove p/ 300 (+100px / 48px-por-linha = 2 passos), mouseup. reorderAt
    // ([0,1,2],0,2) -> [1,2,0]: "escrever docs" cai para o fim.
    await browser.evaluate(`(() => {
        const r = document.getElementById('reorder-1-0');
        const fire = (type, y, target) => (target || r).dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, clientY: y}));
        fire('mousedown', 200, r);
        const c = document.querySelector('.kof-component');
        fire('mousemove', 300, c);
        fire('mouseup', 300, c);
        return true;
    })()`);
    const afterDrag = await browser.evaluate(readOrder);
    assert.match(afterDrag, /^1\. rodar/, `arrastar 2 linhas deve trazer 'rodar' pra linha 0, veio ${JSON.stringify(afterDrag)}`);
    assert.match(afterDrag, /escrever docs/, "'escrever docs' segue presente");
    assert.notEqual(afterDrag, before, 'o re-render deve ter mudado a ordem no DOM');

    // ▲/▼ no browser: depois do arraste 'escrever docs' caiu p/ a última
    // linha; o botão ▲ dela realoca um passo p/ cima (muda a ordem).
    const afterClick = await browser.evaluate(`(() => {
        const c = document.querySelector('.kof-component');
        const btn = [...c.querySelectorAll('.kof-button')].find(b => b.textContent.indexOf('▲ escrever') === 0);
        if (!btn) return 'NAO-ACHOU:' + [...c.querySelectorAll('.kof-button')].map(b=>b.textContent).join('/');
        btn.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
        return 'ok';
    })()`);
    assert.equal(afterClick, 'ok', `deve achar o ▲ de 'escrever docs', veio ${JSON.stringify(afterClick)}`);
    const afterClickOrder = await browser.evaluate(readOrder);
    assert.notEqual(afterClickOrder, afterDrag, 'clique ▼ deve mudar a ordem');

    assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
    console.log(`Chrome: reorder drag moveu linha 0 duas posicoes (${before} -> ${afterDrag}); botao ▼ confirmou por clique (${afterClickOrder}). Arraste Y + commit provados no DOM real.`);
} finally {
    await browser.close();
}
