import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';

// CDP_URL pode apontar para uma instância existente. Por padrão, usa perfil temporário.
export async function openBrowser() {
    let endpoint = process.env.CDP_URL;
    let child, profile;
    if (!endpoint) {
        profile = await fs.mkdtemp(path.join(os.tmpdir(), 'uiw-browser-'));
        child = spawn(process.env.CHROME || 'google-chrome-stable', [
            '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
            '--disable-background-networking', '--allow-file-access-from-files',
            '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
        ], {stdio: ['ignore', 'ignore', 'pipe']});
        let failure = '';
        child.stderr.on('data', data => { failure = (failure + data).slice(-3000); });
        child.on('error', error => { failure = error.message; });
        for (let i = 0; i < 150; i++) {
            try {
                const port = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
                endpoint = `http://127.0.0.1:${port}`;
                break;
            } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
        }
        if (!endpoint) {
            child.kill();
            await fs.rm(profile, {recursive: true, force: true});
            throw new Error(`Chrome não iniciou. Configure CHROME=/caminho/chromium.\n${failure}`);
        }
    }
    const pages = await fetch(`${endpoint}/json/list`).then(r => r.json());
    const page = pages.find(p => p.type === 'page');
    if (!page) throw new Error('Nenhuma página disponível no Chrome.');
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
        const url = pathToFileURL(file).href;
        await send('Page.navigate', {url});
        for (let i = 0; i < 150; i++) {
            if (await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete'`)) return;
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        throw new Error(`Página não carregou: ${file}`);
    }
    async function close() {
        if (child) await send('Browser.close').catch(() => {});
        ws.close();
        if (child) {
            child.kill();
            await new Promise(resolve => setTimeout(resolve, 150));
            await fs.rm(profile, {recursive: true, force: true});
        }
    }
    await send('Page.enable');
    await send('Runtime.enable');
    return {send, evaluate, load, close, errors};
}
