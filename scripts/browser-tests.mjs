import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {openBrowser} from './browser-session.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await openBrowser();
let count = 0;
const failures = [];
try {
    const suites = JSON.parse(await fs.readFile(path.join(root, '.build/browser-tests/suites.json')));
    for (const suite of suites) {
        await browser.load(path.join(root, '.build/browser-tests', suite, 'index.html'));
        const results = await browser.evaluate(`__uiwCases.map(test => {
            try { test.run(); return {name: test.name, pass: true}; }
            catch(error) { return {name: test.name, pass: false, error: String(error.stack || error)}; }
        })`);
        for (const result of results) {
            count++;
            if (!result.pass) failures.push(`${suite} / ${result.name}: ${result.error}`);
            if (!result.pass) console.error(failures.at(-1));
        }
        console.log(`${suite}: ${results.filter(r => r.pass).length}/${results.length}`);
    }
    // Oráculos externos: não dependem do lowering de assert do compilador Kof.
    const actual = await browser.evaluate(`(() => {
        const a = __uiwApi;
        return {
            money: [0, 9, -9, 123456789, 2147483647, -2147483648].map(n => a.formatMoney(n, 'R$')),
            percents: [[3,4],[3,0],[-1,100],[101,100],[2147483647,2147483647]].map(([n,t]) => a.formatPercent(n,t)),
            dates: [1900,1970,2000,2024,2026,2100].flatMap(y => Array.from({length:12}, (_,m) => [y,m+1,a.dayOfWeek(y,m+1,1),a.daysInMonth(y,m+1)])),
            list: a.listText(['A','B','C'], true),
            bars: [a.chartHeight(-1, 10, 100),a.chartHeight(3,4,100),a.chartHeight(2147483647,2147483647,150)],
            emptySeparatorRejected: (() => { try { a.split('abc',''); return false; } catch { return true; } })(),
            invalidDateRejected: (() => { try { a.formatDate(2026,2,29); return false; } catch { return true; } })(),
            calendar: a.monthGrid(2026,8)
        };
    })()`);
    assert.deepEqual(actual.money, ['R$ 0,00','R$ 0,09','-R$ 0,09','R$ 1.234.567,89','R$ 21.474.836,47','-R$ 21.474.836,48']);
    assert.deepEqual(actual.percents, ['75%','—','0%','100%','100%']);
    assert.equal(actual.list, '1. A\n2. B\n3. C');
    assert.deepEqual(actual.bars, [0,75,150]);
    assert.equal(actual.emptySeparatorRejected, true);
    assert.equal(actual.invalidDateRejected, true);
    for (const [year, month, weekday, days] of actual.dates) {
        assert.equal(weekday, new Date(Date.UTC(year, month - 1, 1)).getUTCDay(), `dia da semana ${year}/${month}`);
        assert.equal(days, new Date(Date.UTC(year, month, 0)).getUTCDate(), `dias ${year}/${month}`);
    }
    assert.equal(actual.calendar, 'ago 2026\nD  S  T  Q  Q  S  S\n                   1\n 2  3  4  5  6  7  8\n 9 10 11 12 13 14 15\n16 17 18 19 20 21 22\n23 24 25 26 27 28 29\n30 31\n');
    assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
    assert.equal(failures.length, 0, failures.join('\n'));
    console.log(`${count} testes Kof passaram no Chrome; oráculos externos de datas, valores e erros passaram.`);
} finally { await browser.close(); }
