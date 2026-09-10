// Testa o JavaScript emitido por Kof em Chrome real, sem dependências npm.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const endpoint = process.env.CDP_URL || 'http://127.0.0.1:9223';
const pages = await fetch(`${endpoint}/json/list`).then(r => r.json());
const page = pages.find(p => p.type === 'page');
assert(page, 'Abra Chrome com --headless --remote-debugging-port=9223 --allow-file-access-from-files');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let seq = 0;
const pending = new Map();
const errors = [];
ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
        const task = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) task?.reject(new Error(JSON.stringify(message.error)));
        else task?.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (message.method === 'Debugger.paused') {
        console.error('CAUGHT', message.params.data?.description, message.params.callFrames.slice(0, 4).map(f => f.functionName));
        send('Debugger.resume');
    }
};
function send(method, params = {}) {
    const id = ++seq;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
        pending.set(id, {resolve: x => { clearTimeout(timer); resolve(x); }, reject: e => { clearTimeout(timer); reject(e); }});
        ws.send(JSON.stringify({id, method, params}));
    });
}
async function evaluate(expression) {
    const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
}
async function load(file) {
    await send('Page.navigate', {url: pathToFileURL(path.join(root, file)).href});
    for (let i = 0; i < 100; i++) {
        if (await evaluate('document.readyState === "complete"')) return;
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    throw new Error(`Página não carregou: ${file}`);
}
async function click(id) {
    await evaluate(`(() => { const el = document.getElementById(${JSON.stringify(id)}); if (!el) throw new Error('Elemento ausente: ${id}'); el.click(); })()`);
}
await send('Page.enable');
await send('Runtime.enable');
await send('Debugger.enable');
await send('Debugger.setPauseOnExceptions', {state: 'all'});
await send('Emulation.setDeviceMetricsOverride', {width: 1280, height: 1100, deviceScaleFactor: 1, mobile: false});
try {
    await load('.build/web/showcase/index.html');
    const snapshots = {};
    for (const route of ['type', 'style', 'layout', 'forms', 'data', 'charts', 'media', 'events']) {
        await click(`nav-${route}`);
        snapshots[route] = await evaluate('({text: document.body.innerText, nodes: document.querySelectorAll(".kof-component").length, inputs: document.querySelectorAll("input").length, canvases: document.querySelectorAll("canvas").length})');
        console.log(route, snapshots[route]);
    }
    await fs.mkdir(path.join(root, '.build/browser'), {recursive: true});
    await fs.writeFile(path.join(root, '.build/browser/snapshots.json'), JSON.stringify({snapshots, errors}, null, 2));
    await click('nav-type');
    const shot = await send('Page.captureScreenshot', {format: 'png'});
    await fs.writeFile(path.join(root, '.build/browser/showcase.png'), Buffer.from(shot.data, 'base64'));
    assert.equal(errors.length, 0, JSON.stringify(errors));
} finally {
    ws.close();
}
