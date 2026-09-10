// Compila as suítes Kof e publica uma ponte apenas nos artefatos de teste.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kof = process.env.KOF || 'kof';
const modules = (await fs.readdir(path.join(root, 'src'))).filter(f => f.endsWith('.kf')).sort();
const lib = (await Promise.all(modules.map(f => fs.readFile(path.join(root, 'src', f), 'utf8')))).join('\n');
const functions = [...lib.matchAll(/^(\w+)\([^\n]*\): \w+/gm)].map(m => m[1]);
const suites = [];
for (const file of (await fs.readdir(path.join(root, 'tests'))).filter(f => f.endsWith('.kf')).sort()) {
    const name = path.basename(file, '.kf');
    const source = await fs.readFile(path.join(root, 'tests', file), 'utf8');
    const cases = [...source.matchAll(/^test "([^"]+)"/gm)].map(m => m[1]);
    const input = path.join(root, '.build/tests', name);
    const output = path.join(root, '.build/browser-tests', name);
    await fs.mkdir(input, {recursive: true});
    await fs.writeFile(path.join(input, 'main.kf'), lib + '\n' + source);
    const result = spawnSync(kof, ['build', input, '--target', 'js', '--output', output], {encoding: 'utf8'});
    if (result.error || result.status !== 0) throw new Error(`${name}: ${result.error || result.stdout + result.stderr}`);
    await fs.appendFile(path.join(output, 'Default.mjs'), `\nglobalThis.__uiwApi = {${functions.join(',')}};\nglobalThis.__uiwCases = [${cases.map((name, i) => `{name:${JSON.stringify(name)},run:kof_test_${i}}`).join(',')}];\n`);
    suites.push(name);
}
await fs.writeFile(path.join(root, '.build/browser-tests/suites.json'), JSON.stringify(suites));
console.log(`${suites.length} suítes compiladas para JS.`);
