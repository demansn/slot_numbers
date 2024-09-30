import {SlotMachine} from "../src/SlotMashine.js";
import {test, describe} from "node:test";
import * as assert from "node:assert";

describe('SlotMachine:', () => {
    test('should initialize properly with session data', async () => {
        const apiMock = {
            loadSession: async ({uid}) => ({
                uid,
                balance: 1000,
                bet: 10,
                bets: [10, 20, 50],
                rolls: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            })
        };

        const slotMachine = new SlotMachine({api: apiMock, uid: 'test-uid'});

        await slotMachine.init();

        assert.strictEqual(slotMachine.balance, 1000);
        assert.deepStrictEqual(slotMachine.bets, [10, 20, 50]);
        assert.deepStrictEqual(slotMachine.rolls, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        assert.strictEqual(slotMachine.bet, 10);
    });

    test('should throw an error when setting an invalid bet', () => {
        const slotMachine = new SlotMachine({api: {}, uid: 'test-uid'});

        slotMachine.bets = [10, 20, 50];

        assert.throws(() => slotMachine.setBet(5), /Invalid bet/);
    });

    test('should set a valid bet correctly', () => {
        const slotMachine = new SlotMachine({api: {}, uid: 'test-uid'});

        slotMachine.bets = [10, 20, 50];

        slotMachine.setBet(20);

        assert.strictEqual(slotMachine.bet, 20);
    });

    test('should update state after placing a bet', async () => {
        const apiMock = {
            spin: async ({bet, uid}) => ({
                balance: 900,
                bet,
                rolls: [[1, 1, 1], [2, 2, 2], [3, 3, 3]],
                payLines: [[{row: 0, column: 0}, {row: 0, column: 1}, {row: 0, column: 2}]],
            })
        };

        const slotMachine = new SlotMachine({api: apiMock, uid: 'test-uid'});

        slotMachine.bets = [10, 20, 50];
        slotMachine.setBet(10);

        const result = await slotMachine.placeBet();

        assert.strictEqual(slotMachine.balance, 900);
        assert.strictEqual(slotMachine.bet, 10);
        assert.deepStrictEqual(slotMachine.rolls, [[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
        assert.deepStrictEqual(slotMachine.payLines, [[{row: 0, column: 0}, {row: 0, column: 1}, {row: 0, column: 2}]]);
        assert.deepStrictEqual(result, slotMachine.spinResult);
    });
});
