import {ValuePanel} from "../objects/ValuePanel.js";
import {Button} from "../objects/Button.js";

export class BetsPanel extends ValuePanel {
    constructor({bets, bet, onChanged}) {
        super({
            backgroundTexture: "bet_panel",
            value: "0",
            valueStyle: "panelValue",
            label: "BET"
        });

        this.onChanged = onChanged;
        this.bets = bets;
        this.currentBetIndex = bets.indexOf(bet);

        this.plusBtn = this.create.displayObject(Button, {
            name: "plus",
            scale: 0.8,
            onClick: () => this.nextBet()
        });

        this.plusBtn.x = this.background.width - this.plusBtn.width - 10;
        this.plusBtn.y = this.background.height / 2 - this.plusBtn.height / 2;

        this.minusBtn = this.create.displayObject(Button, {
            name: "minus",
            scale: 0.8,
            onClick: () => this.prevBet()
        });

        this.minusBtn.x = 10;
        this.minusBtn.y = this.background.height / 2 - this.minusBtn.height / 2;

        this.updateState();
    }

    setBetByIndex(index) {
        if (index === this.currentBetIndex) {
            return;
        }

        this.currentBetIndex = index;
        this.updateState();
        this.onChanged(this.bets[index]);
    }

    updateState() {
        this.value = this.bets[this.currentBetIndex];

        if (this.currentBetIndex === 0) {
            this.minusBtn.disable();
        } else {
            this.minusBtn.enable();
        }

        if (this.currentBetIndex === this.bets.length - 1) {
            this.plusBtn.disable();
        } else {
            this.plusBtn.enable();
        }
    }

    nextBet() {
        const betIndex = this.currentBetIndex + 1;

        if (betIndex >= this.bets.length) {
            return;
        }

        this.setBetByIndex(betIndex);
    }

    prevBet() {
        const betIndex = this.currentBetIndex - 1;

        if (betIndex < 0) {
            return;
        }

        this.setBetByIndex(betIndex);
    }

    disable() {
        this.plusBtn.disable();
        this.minusBtn.disable();
    }

    enable(){
        this.updateState();
    }
}
