import {SuperContainer} from "./SuperContainer.js";

export class Button extends SuperContainer {
    constructor({name, onClick}) {
        super();

        this.namePrefix = name;
        this.sprite = this.create.sprite({texture: this.getTextureNameByState('default')});
        this.onClick = onClick;

        this.cursor = "pointer";
        this.on("pointerdown", this.onPointerDown, this);
        this.on("pointerup", this.onPointerUp, this);
        this.on("pointerover", this.onPointerOver, this);
        this.on("pointerout", this.onPointerOut, this);

        this.enable();
    }

    onPointerDown() {
        this.setTextureByState("clicked");
    }

    onPointerUp() {
        this.setTextureByState("default");

        if (this.onClick) {
            this.onClick();
        }
    }

    onPointerOver() {
        this.setTextureByState("hover");
    }

    onPointerOut() {
        this.setTextureByState("default");
    }

    getTextureNameByState(state) {
        return `${this.namePrefix}_btn_${state}`;
    }

    setTextureByState(state) {
        this.sprite.texture = this.create.getTexture(this.getTextureNameByState(state));
    }

    enable() {
        this.setTextureByState("default");
        this.interactive = true;
        this.buttonMode = true;
    }

    disable() {
        this.setTextureByState("disabled");
        this.interactive = false;
        this.buttonMode = false;
    }
}
