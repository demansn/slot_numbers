import State from "../stateMachine/State.js";

export class Result extends State {
    onEnter() {
        this.game = this.parent;
        this.scene = this.game.currentScene;
        this.slotMashine = this.game.slotMashine;

        console.log(this.slotMashine.spinResult);

        this.showResult(this.slotMashine.spinResult);
    }

    async showResult(result) {
        await this.scene.showResult(result);

        this.parent.gotoState('idle');
    }

    onLeave() {
    }
}
