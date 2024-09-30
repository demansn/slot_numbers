import {SuperContainer} from "../objects/SuperContainer.js";
import {RollsView} from "../rolls/RollsView.js";
import {HUD} from "../hud/HUD.js";

export class GamePlayScene extends SuperContainer {
    constructor({gameConfig, rolls, balance, bets, bet}) {
        super();

        this.rollsView = this.create.displayObject(RollsView, {
            rolls: rolls,
            slotSymbols: gameConfig.symbols,
            symbolWidth: gameConfig.symbolWidth,
            symbolHeight: gameConfig.symbolHeight,
            spinningSpeed: gameConfig.spinningSpeed,
            columns: gameConfig.columns,
            rows: gameConfig.rows
        });

        this.rollsView.x = gameConfig.size.width / 2 - this.rollsView.width / 2;
        this.rollsView.y = 100;

        this.hud = this.create.displayObject(HUD, {
            gameConfig,
            balance,
            bets,
            bet
        });
        this.hud.on("spin", () => this.emit("spin"));
        this.hud.on("betChanged", (bet) => this.emit("betChanged", bet));
    }

    enableHUD(){
        this.hud.enable();
    }

    updateBalance(balance) {
        this.hud.updateBalance(balance);
    }

    startSpinning() {
        this.hud.disable();
        this.rollsView.startSpinning();
    }

    stopSpinning(rolls) {
        this.rollsView.stopSpinning(rolls);
    }

    showResult(result) {
        this.hud.showResult(result);
        return this.rollsView.animatePayLines(result.payLines);
    }

    update(dt) {
        this.rollsView.update(dt);
    }
}
