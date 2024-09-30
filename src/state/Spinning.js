import State from "../stateMachine/State.js";

export class Spinning extends State {
    stopTimer = null;

    onEnter() {
        this.game = this.parent;
        this.scene = this.game.currentScene;
        this.slotMashine = this.game.slotMashine;
        this.startSpinning();
    }

    async startSpinning() {
        this.scene.startSpinning();

        await Promise.all([
            await this.placeBet(),
            this.wait(1000)
        ]);

        if (this.slotMashine.spinResult.win > 0) {
            this.game.gotoState('result');
        } else {
            this.game.gotoState('idle');
        }
    }

    placeBet() {
        this.scene.updateBalance(this.slotMashine.balance - this.slotMashine.bet);

        return this.slotMashine.placeBet();
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onLeave() {
        this.scene.stopSpinning(this.slotMashine.rolls);
    }
}
