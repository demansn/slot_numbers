import {describe, test} from "node:test";
import assert from "node:assert";
import {OfflineAPI} from "../src/api/offline/OfflineAPI.js";
import {ServerError} from "../src/api/ServerError.js";
import {OfflineSlotMath} from "../src/api/offline/OfflineSlotMath.js";

describe('OfflineAPI:', () => {
    test('should create a new session if none exists', async () => {
        const storageMock = {
            getItem: () => null,
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });
        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const session = await api.loadSession({uid: 'test-session'});

        assert.strictEqual(session.balance, 1000);
    });

    test('should load an existing session', async () => {
        const existingSession = {uid: 'test-session', balance: 500, bet: 10, rolls: [[1, 1, 1]]};
        const storageMock = {
            getItem: () => JSON.stringify(existingSession),
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });
        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const session = await api.loadSession({uid: 'test-session'});

        assert.strictEqual(session.balance, 500);
        assert.deepStrictEqual(session.rolls, [[1, 1, 1]]);
    });

    test('should return ServerError when session not found', async () => {
        const storageMock = {
            getItem: () => null,
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });
        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const result = await api.spin({bet: 10, uid: 'invalid-session'});

        assert.ok(result instanceof ServerError);
        assert.strictEqual(result.message, 'Session not found');
    });

    test('should return ServerError for insufficient balance', async () => {
        const session = {uid: 'test-session', balance: 5, bet: 10, rolls: [[1, 1, 1]]};
        const storageMock = {
            getItem: () => JSON.stringify(session),
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });
        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const result = await api.spin({bet: 20, uid: 'test-session'});

        assert.ok(result instanceof ServerError);
        assert.strictEqual(result.message, 'Insufficient funds');
    });

    test('should perform a spin and update session balance and rolls', async () => {
        const session = {uid: 'test-session', balance: 1000, bet: 10, rolls: [[1, 1, 1]]};
        const storageMock = {
            getItem: () => JSON.stringify(session),
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });

        mathMock.spin = () => ({
            rolls: [[2, 2, 2]],
            win: 50,
            payLines: [[{row: 0, column: 0}, {row: 0, column: 1}, {row: 0, column: 2}]],
        });

        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const result = await api.spin({bet: 10, uid: 'test-session'});

        assert.strictEqual(result.balance, 1040);
        assert.deepStrictEqual(result.rolls, [[2, 2, 2]]);
        assert.strictEqual(result.payLines.length, 1);
    });

    test('should handle a losing spin and update balance accordingly', async () => {
        const session = {uid: 'test-session', balance: 500, bet: 10, rolls: [[1, 1, 1]]};
        const storageMock = {
            getItem: () => JSON.stringify(session),
            setItem: () => {
            }
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });

        mathMock.spin = () => ({
            rolls: [[3, 3, 3]],
            win: 0,
            payLines: [],
        });

        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const result = await api.spin({bet: 50, uid: 'test-session'});

        assert.equal(result.balance, 450);
        assert.equal(result.win, 0);
        assert.equal(result.payLines.length, 0);
    });

    test('should return ServerError for invalid bet', async () => {
        const session = { uid: 'test-session', balance: 500, bet: 10, rolls: [[1, 1, 1]] };
        const storageMock = {
            getItem: () => JSON.stringify(session),
            setItem: () => {}
        };
        const mathMock = new OfflineSlotMath({
            payTables: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
            rows: 3,
            columns: 3
        });

        const api = new OfflineAPI({
            storage: storageMock,
            math: mathMock,
            bets: [10, 20, 50],
            balance: 1000,
            bet: 10
        });

        const result = await api.spin({ bet: 5, uid: 'test-session' });

        assert.ok(result instanceof ServerError);
        assert.equal(result.message, 'Invalid bet');
    });
});

