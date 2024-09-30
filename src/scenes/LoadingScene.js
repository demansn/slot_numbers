import {SuperContainer} from "../objects/SuperContainer.js";

export class LoadingScene extends SuperContainer {
    constructor({gameConfig}) {
        super();
        this.gameConfig = gameConfig;

        this.loadingText = this.create.text({
            text: '0',
            style: 'loadingText',
            x: this.gameConfig.size.width / 2,
            y: this.gameConfig.size.height / 2,
            anchor:0.5
        });
    }

    updateProgress(progress) {
        this.loadingText.text = `${progress}%`;
    }
}
