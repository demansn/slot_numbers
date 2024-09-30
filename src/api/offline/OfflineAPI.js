import {ServerError} from "../ServerError.js";
import {OfflineSlotMath} from "./OfflineSlotMath.js";

export class OfflineAPI {
    static fromBrowser({gameConfig}) {
        return new OfflineAPI({
            storage: window.localStorage,
            math: new OfflineSlotMath({...gameConfig}),
            ...gameConfig,
        })
    }

    constructor({storage, math, bets, balance, bet}) {
        this.storage = storage;
        this.bets = bets;
        this.defaultSessionParamters = {
            balance: balance,
            bet: bet,
            rolls: math.rolls,
            bets
        };

        this.math = math;
        this.currentSession = null;
    }

    emulateConnectionDelay() {
        const delay = Math.floor(Math.random() * 1000);

        return new Promise(resolve => setTimeout(resolve, delay));
    }

    hasSession(uid) {
        return this.storage.getItem(uid) !== null;
    }

    getSession(sessionId) {
        return JSON.parse(this.storage.getItem(sessionId));
    }

    saveSession(session) {
        this.storage.setItem(session.uid, JSON.stringify(session));
    }

    createSession(uid) {
        const session = {
            uid,
            ...this.defaultSessionParamters
        };

        this.storage.setItem(uid, JSON.stringify(session));

        return session;
    }

    async loadSession({uid}) {
        try {
            const session = this.hasSession(uid) ? this.getSession(uid) : this.createSession(uid);

            await this.emulateConnectionDelay();

            return session;
        } catch (error) {
            return new ServerError(error.message);
        }
    }

    async spin({bet, uid}) {
        try {
            const session = this.getSession(uid);

            if (!session) {
                return new ServerError('Session not found');
            }

            if (!this.bets.includes(bet)) {
                return new ServerError('Invalid bet');
            }

            if (session.balance < bet) {
                return new ServerError('Insufficient funds');
            }

            session.balance -= bet;

            const spinResult =  this.math.spin(bet);

            if (spinResult.win > 0) {
                session.balance += spinResult.win;
            }

            session.bet = bet;
            session.rolls = spinResult.rolls;

            this.saveSession(session);

            await this.emulateConnectionDelay();

            return {uid, ...session, win: spinResult.win, payLines: spinResult.payLines};
        } catch (error) {
             return new ServerError(error.message);
         }
    }
}
