import {SuperContainer} from "./SuperContainer.js";

export class ValuePanel extends SuperContainer {
    constructor({backgroundTexture, value, valueStyle, label}) {
        super();

        this.background = this.create.sprite({texture: backgroundTexture});
        this.create.text({
            text: label,
            style: valueStyle,
            anchor: 0.5,
            x: this.background.width / 2,
            y: -15
        });

        this.text = this.create.text({
            text: value,
            style: valueStyle,
            anchor: 0.5,
            x: this.background.width / 2,
            y: this.background.height / 2
        });
    }

    set value(value) {
        this.text.text = value;
    }

    get value() {
        return this.text.text;
    }
}
