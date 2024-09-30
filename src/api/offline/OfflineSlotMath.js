export class OfflineSlotMath {
    constructor({payTables, rows, columns}) {
        this.payLines = [];
        this.rows = rows;
        this.columns = columns;
        this.rolls = [];
        this.minSymbolsInPayLine = 2;
       this.symbols = [];

        for (let i = 0; i < 9; i++) {
            const weight = (9 - i) * 100;

            for (let j = 0; j < weight; j++) {
                this.symbols.push(i);
            }
        }

        payTables.forEach(payTable => {
            const payLine = [];

            this.forEachPositions((column, row) => {
                if (payTable[row][column]) {
                    payLine.push({row, column});
                }
            });

            this.payLines.push(payLine);
        });

        this.fillRollsRandomSymbols()
    }

    forEachPositions(callback) {
        for (let column = 0; column < this.columns; column++) {
             for (let row = 0; row < this.rows; row++) {
                callback(column, row);
            }
        }
    }

    getRandSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    fillRollsRandomSymbols() {
        for (let i = 0; i < this.rows; i++) {
            if (!this.rolls[i]) {
                this.rolls[i] = [];
            }
            for (let j = 0; j < this.columns; j++) {
                this.rolls[i][j] = this.getRandSymbol();
            }
        }
    }

    getWinPayLines() {
        const winPayLines = [];

        for (let i = 0; i < this.payLines.length; i++) {
            const payLinePositions = this.payLines[i];
            const firstPosition = payLinePositions[0];
            const symbol = this.rolls[firstPosition.column][firstPosition.row];
            const isWin = payLinePositions.every(({row, column}) => this.rolls[column][row] === symbol);

            if (isWin) {
                winPayLines.push(payLinePositions);
            }
        }

        return winPayLines;
    }

    spin(bet) {
        this.fillRollsRandomSymbols();

        const payLines = this.getWinPayLines();
        const win = payLines.length ? payLines.reduce((acc, payLine) => payLine.length * bet + acc, 0) : 0;

        return {rolls: this.rolls, win, payLines};
    }
}
