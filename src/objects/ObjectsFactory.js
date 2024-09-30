import {Graphics, Sprite, Text, TextStyle} from "pixi.js";
import gsap from 'gsap';
import {SuperContainer} from "./SuperContainer.js";

export class ObjectsFactory {
    constructor(parent, textures, styles) {
        this.parent = parent;
        this.textures= textures;
        this.styles= styles;
    }

    setDisplayObjectProperties(displayObject, properties = {}) {
        const {x = 0, y = 0, anchor, scale, ...other} = properties;

        if (anchor) {
            if (typeof anchor === 'number') {
                displayObject.anchor.set(anchor);
            } else {
                if (anchor.x !== undefined) {
                    displayObject.anchor.x = anchor.x;
                }

                if (anchor.y !== undefined) {
                    displayObject.anchor.y = anchor.y;
                }
            }
        }

        if (scale) {
            if (typeof scale === 'number') {
                displayObject.scale.set(scale);
            } else {
                if (scale.x !== undefined) {
                    displayObject.scale.x = scale.x;
                }

                if (scale.y !== undefined) {
                    displayObject.scale.y = scale.y;
                }
            }
        }

        if (typeof x === 'string') {
            const [_, sign, value, percent] = /([-+]?)(\d+)(%?)/.exec(x);
            const offset = percent ? displayObject.width * parseFloat(value) / 100 : parseFloat(value);

            displayObject.x = sign === '-' ? -offset : offset;
        } else {
            displayObject.x = x;
        }

        if (typeof y === 'string') {
            const [_, sign, value, percent] = /([-+]?)(\d+)(%?)/.exec(y);
            const offset = percent ? displayObject.width * parseFloat(value) / 100 : parseFloat(value);

            displayObject.y = sign === '-' ? -offset : offset;
        } else {
            displayObject.y = y;
        }

        other && Object.keys(other).forEach(key => {
            if (displayObject[key] !== undefined && other[key] !== undefined) {
                displayObject[key] = other[key];
            }
        });
    }

    sprite({texture, ...properties}) {
        const displayObject = new Sprite(this.textures.get(texture));

        return this.addAndSetProperties(displayObject, properties);
    }

    getTexture(texture) {
        return this.textures.get(texture);
    }

    text({text = '', style = '', ...properties} = {}) {
        const displayObject = new Text(text, new TextStyle(this.styles.get(style)));

        displayObject.resolution = 2;

        return this.addAndSetProperties(displayObject, properties);
    }

    graphics(properties = {}) {
        const displayObject = new Graphics();

        return this.addAndSetProperties(displayObject, properties);
    }

    container(properties) {
        const displayObject = new SuperContainer();

        return this.addAndSetProperties(displayObject, properties);
    }

    displayObject(displayObjectConstructor, properties) {
        const displayObject = new displayObjectConstructor(properties);

        return this.addAndSetProperties(displayObject, properties);
    }

    addAndSetProperties(displayObject, properties) {
        this.addDisplayObject(displayObject, properties)
        this.setDisplayObjectProperties(displayObject, properties);

        return displayObject;
    }

    addDisplayObject(displayObject, properties) {
        this.parent.addChild(displayObject);
    }

    tweenTo(displayObject, properties) {
        return gsap.to(displayObject, properties);
    }

    timeline() {
        return gsap.timeline();
    }
}
