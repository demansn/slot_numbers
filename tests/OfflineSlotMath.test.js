import {describe, test} from "node:test";
import assert from "node:assert";
import {OfflineSlotMath} from "../src/api/offline/OfflineSlotMath.js";

const payTables = [
    [
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0]
    ]
];

describe('OfflineSlotMath:', () => {
    test('initialization and default values', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });

        assert.strictEqual(slotMath.rows, 3, 'Number of rows should be 3');
        assert.strictEqual(slotMath.columns, 3, 'Number of columns should be 3');
        assert.strictEqual(slotMath.payLines.length, 1, 'PayLines should be initialized with 1 payLine');
        assert(slotMath.rolls.length === 3, 'Rolls array should have 3 rows initialized with random symbols');
    });

    test('getRandSymbol generates valid symbols', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });
        const symbol = slotMath.getRandSymbol();

        assert(symbol >= 0 && symbol < 9, 'Generated symbol should be between 0 and 8');
    });

    test('fillRollsRandomSymbols fills rolls with random values', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });

        slotMath.fillRollsRandomSymbols();
        assert(slotMath.rolls.length === 3, 'Rolls should have 3 rows');
        assert(slotMath.rolls[0].length === 3, 'Each row should have 3 symbols');
        assert(slotMath.rolls[0][0] >= 0 && slotMath.rolls[0][0] < 9, 'Each symbol should be between 0 and 8');
    });

    test('getWinPayLines returns correct paylines', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });

        slotMath.rolls = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        const winPayLines = slotMath.getWinPayLines();
        assert(winPayLines.length > 0, 'There should be at least 1 winning payline');
    });

    test('spin should return win and paylines', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });

        const result = slotMath.spin(10);
        assert(result.rolls.length === 3, 'Result should contain 3 rows of rolls');
        assert(result.win >= 0, 'Win should be a non-negative number');
        assert(result.payLines.length >= 0, 'PayLines should be an array of winning paylines or empty');
    });

    test('spin should return zero win for losing spin', () => {
        const slotMath = new OfflineSlotMath({ payTables, rows: 3, columns: 3 });

        slotMath.rolls = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];

        const result = slotMath.spin(10); // Выполним спин с бетом 10

        assert.strictEqual(result.win, 0, 'Win should be 0 for a losing spin');
        assert.strictEqual(result.payLines.length, 0, 'There should be no winning paylines');
    });
});
