export class SlotMachine {
    constructor({api, uid}) {
        this.api = api;
        this.uid = uid;
        this.balance = 0;
        this.bet = 0;
        this.bets = [];
        this.rolls = [];
        this.payLines = [];
    }

    setBet(bet) {
        if (!this.bets.includes(bet)) {
            throw new Error('Invalid bet');
        }

        this.bet = bet;
    }

    async init() {
        const session = await this.api.loadSession({uid: this.uid});

        this.balance = session.balance;
        this.bets = session.bets;
        this.rolls = session.rolls;

        this.setBet(session.bet);
    }

    async placeBet() {
        const result = await this.api.spin({bet: this.bet, uid: this.uid});

        this.balance = result.balance;
        this.bet = result.bet;
        this.rolls = result.rolls;
        this.payLines = result.payLines || [];

        this.spinResult = result;

        return result;
    }
}
