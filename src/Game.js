import {StateMachine} from "./stateMachine/StateMachine.js";
import * as PIXI from "pixi.js";
import {Loading} from "./state/Loading.js";
import {Idle} from "./state/Idle.js";
import {SlotMachine} from "./SlotMashine.js";
import {GamePlayScene} from "./scenes/GamePlayScene.js";
import {Spinning} from "./state/Spinning.js";
import {Result} from "./state/Result.js";

export class Game extends StateMachine {
    static from(params) {
        return new Game(params);
    }
    constructor({config, api, uid} = {}) {
        super();

        this.config = config;
        this.slotMashine = new SlotMachine({api, uid});
        this.app = new PIXI.Application();

        this.addStates({
            loading: Loading,
            idle: Idle,
            spin: Spinning,
            result: Result,
        });

        this.gotoState('loading');
    }

    async init() {
        await this.app.init({
            ...this.config.size,
            backgroundColor: 0x1099bb
        });
        await this.slotMashine.init();

        document.body.appendChild(this.app.canvas);

        this.app.ticker.add(this.update.bind(this));
    }

    showGamePlayScene() {
        const gameScene = new GamePlayScene({
            gameConfig: this.config,
            rolls: this.slotMashine.rolls,
            balance: this.slotMashine.balance,
            bets: this.slotMashine.bets,
            bet: this.slotMashine.bet
        });

        this.setScene(gameScene);
    }

    setScene(scene) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }

        this.currentScene = scene;
        this.app.stage.addChild(scene);
    }

    update(t) {
        this.currentScene.update && this.currentScene.update(t.deltaTime);
    }
}
