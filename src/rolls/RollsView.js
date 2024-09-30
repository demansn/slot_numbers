import {SuperContainer} from "../objects/SuperContainer.js";
import {RollView} from "./RollView.js";

export class RollsView extends SuperContainer {
    constructor({rolls, slotSymbols, symbolWidth, symbolHeight, spinningSpeed, columns, rows}) {
        super();
        this.rolls = rolls;
        this.slotSymbols = slotSymbols;
        this.symbolWidth = symbolWidth;
        this.symbolHeight = symbolHeight;
        this.spinningSpeed = spinningSpeed;
        this.rollsViews = [];

        this.mask = this.create.graphics();
        this.mask.beginFill(0xFFFFFF);
        this.mask.drawRect(0, -this.symbolHeight /2, this.symbolWidth * columns , this.symbolHeight * rows);
        this.mask.endFill();

        this.init();
    }

    init() {
        this.rolls.forEach((roll, index) => {
            const rollView = new RollView({roll, slotSymbols: this.slotSymbols, symbolWidth: this.symbolWidth, symbolHeight: this.symbolHeight, spinningSpeed: this.spinningSpeed});
            rollView.x = (index * this.symbolWidth) + this.symbolWidth / 2;

            this.rollsViews.push(rollView);
            this.addChild(rollView);
        });
    }

    replace(rolls) {
        this.rollsViews.forEach((rollView, index) => {
            rollView.replaceSymbols(rolls[index]);
        });
    }

    startSpinning() {
        const timeline = this.create.timeline();

        timeline.add(this.rollsViews.map(roll => roll.startSpinning()), '-=0.1');

        return timeline;
    }

    stopSpinning(rolls) {
        this.rollsViews.forEach((rollView, index) => {
            rollView.stopSpinning(rolls[index]);
        });
    }

    animatePayLines(payLines) {
        const timeline = this.create.timeline();

        payLines.forEach(payLine => {
            timeline.add(this.getPayLineAnimation(payLine))
        });
    }

    getPayLineAnimation(payLine) {
        const timeline = this.create.timeline();

        timeline.add(payLine.map(({row, column}) => {
            const symbol = this.rollsViews[column].getSymbolByPosition(row);

            return symbol && symbol.animate();
        }));

        return timeline;
    }

    update(dt) {
        this.rollsViews.forEach((rollView) => {
            rollView.update(dt);
        });
    }
}
