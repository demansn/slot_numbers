import {ValuePanel} from "../objects/ValuePanel.js";
import {BetsPanel} from "./BetsPanel.js";
import {Button} from "../objects/Button.js";
import {SuperContainer} from "../objects/SuperContainer.js";

export class HUD extends SuperContainer {
    constructor({gameConfig, balance, win, bet, bets}) {
        super();

        this.balancePanel = this.create.displayObject(ValuePanel, {
            backgroundTexture: "balance_panel",
            value: balance,
            valueStyle: "panelValue",
            label: "BALANCE",
            x: 90,
            y: gameConfig.size.height - 70
        });

        this.winPanel = this.create.displayObject(ValuePanel, {
            backgroundTexture: "win_panel",
            value: win,
            valueStyle: "panelValue",
            label: "WIN",
            x: this.balancePanel.x + this.balancePanel.width + 10,
            y: gameConfig.size.height - 70
        });

        this.betsPanel = this.create.displayObject(BetsPanel, {
            bets,
            bet,
            onChanged: (value) => this.onBetChanged(value),
            x:  this.winPanel.x + this.winPanel.width + 10,
            y: gameConfig.size.height - 70
        });

        this.spinBtn = this.create.displayObject(Button, {
            name: "spin",
            onClick: () => this.onSpin(),
        });

        this.spinBtn.x = gameConfig.size.width - (this.spinBtn.width + 10);
        this.spinBtn.y = gameConfig.size.height / 2 - this.spinBtn.height / 2;
    }

    update({balance, win}) {
        this.balancePanel.value = balance;
        this.winPanel.value = win;
    }

    onBetChanged(value) {
        this.emit("betChanged", value);
    }

    onSpin() {
        this.emit("spin");
    }

    enable() {
        this.betsPanel.enable();
        this.spinBtn.enable();
    }

    disable() {
        this.betsPanel.disable();
        this.spinBtn.disable();
    }

    updateBalance(value) {
        this.balancePanel.value = value;
    }

    showResult({win, balance}) {
        this.winPanel.value = win;
        this.balancePanel.value = balance;
    }
}
