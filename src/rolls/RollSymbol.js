import {SuperContainer} from "../objects/SuperContainer.js";

export class RollSymbol extends SuperContainer {
    constructor(id) {
        super();

        this.id = id;
        this.spite =  this.create.sprite({texture: `symbol_${id}`, anchor: 0.5, scale: 0.4});
    }

    animate() {
        const timeline = this.create.timeline();

        timeline
            .add(this.create.tweenTo(this.spite.scale, {duration: 0.5, x: '-=0.1', y: '-=0.1', repeat: 3, yoyo: true}))

        return timeline;
    }
}
