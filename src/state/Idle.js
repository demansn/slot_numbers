import State from "../stateMachine/State.js";

export class Idle extends State {
    onEnter() {
        this.game = this.parent;
        this.scene = this.game.currentScene;
        this.slotMashine = this.game.slotMashine;

        this.scene.on('spin', this.onSpin, this);
        this.scene.on('betChanged', this.onBetChanged, this);
        this.scene.enableHUD();
    }

    onLeave() {
        this.scene.off('spin', this.onSpin, this);
        this.scene.off('betChanged', this.onBetChanged, this);
    }

    onBetChanged(bet) {
        this.slotMashine.setBet(bet);
    }

    onSpin() {
        this.game.gotoState('spin');
    }
}
