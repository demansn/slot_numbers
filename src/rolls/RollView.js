import {SuperContainer} from "../objects/SuperContainer.js";
import {RollSymbol} from "./RollSymbol.js";

export class RollView extends SuperContainer {
    constructor({roll, spinningSpeed, slotSymbols, symbolHeight}) {
        super();
        this.symbols = [];
        this.speed = 0;
        this.spinningSpeed = spinningSpeed;
        this.slotSymbols = slotSymbols;
        this.symbolHeight = symbolHeight;
        this.reelStep = 0;
        this.reelHeight = roll.length * this.symbolHeight;

        this.init(roll);
    }

    init(roll) {
        roll.forEach((symbolID, row) => this.addNewSymbol(symbolID, row));
    }

    replaceSymbols(roll) {
        this.symbols.forEach((symbol) =>symbol.destroy());

        this.symbols = [];

        this.init(roll);
    }

    startSpinning() {
        this.addRandomSymbol(-1);

        return this.create.tweenTo(this, {speed: this.spinningSpeed, duration: 0.5});
    }

    stopSpinning(roll) {
        this.speed = 0;
        this.reelStep = 0;
        this.replaceSymbols(roll);
    }

    getSymbolByPosition(row, dy = 0) {
        return this.symbols.find(symbol => symbol.y === (row * this.symbolHeight) + dy);
    }

    addSymbol(symbol) {
        this.addChild(symbol);
        this.symbols.push(symbol);
    }

    addRandomSymbol(row, dy = 0) {
        const id = this.slotSymbols[Math.floor(Math.random() * this.slotSymbols.length)];

        this.addNewSymbol(id, row, dy);
    }

    createSymbol(id, row, dy = 0) {
        const symbol = new RollSymbol(id);

        symbol.y = (row * this.symbolHeight) + dy;

        return symbol;
    }

    addNewSymbol(id, row, dy = 0) {
        const symbol = this.createSymbol(id, row, dy);

        this.addSymbol(symbol);

        return symbol;
    }

    removeSymbol(symbol) {
        this.removeChild(symbol);
        this.symbols.splice(this.symbols.indexOf(symbol), 1);
    }

    update(dt) {
        const symbolsToRemove = [];
        const step = dt * this.speed;

        if (this.speed > 0) {
            this.reelStep += step;

            this.symbols.forEach(symbol => {
                symbol.y +=step;

                if ((symbol.y - this.symbolHeight / 2) > this.reelHeight) {
                    symbolsToRemove.push(symbol);
                }
            });

            symbolsToRemove.forEach(symbol => {
                this.removeSymbol(symbol);
            });

            if (this.reelStep > this.symbolHeight) {
                const dy = this.reelStep - this.symbolHeight;
                this.reelStep = 0;

                this.addRandomSymbol(-1, dy);
            }
        }
    }
}
