import State from "../stateMachine/State.js";
import {Assets} from "pixi.js";
import {LoadingScene} from "../scenes/LoadingScene.js";
import {GamePlayScene} from "../scenes/GamePlayScene.js";

export class Loading extends State {
        onEnter() {
            this.game = this.parent;
            this.init();
        }

        onLeave() {
            this.game.showGamePlayScene();
        }

        async init() {
            await this.game.init();

            this.scene = new LoadingScene({gameConfig: this.game.config});
            this.game.setScene(this.scene);

            await Assets.init({manifest: this.parent.config.resourcesManifest});
            await Assets.loadBundle('game', this.onProgress.bind(this));

            this.loaded();
        }

        onProgress(progress) {
            this.scene.updateProgress(progress.toFixed(2) * 100);
        }

        loaded() {
            this.parent.gotoState('idle');
        }
}
