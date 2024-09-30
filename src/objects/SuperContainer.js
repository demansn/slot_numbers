import {Container} from "pixi.js";
import {ObjectsFactory} from "./ObjectsFactory.js";
import {resources} from "../Resources.js";
import {styles} from "../Styles.js";

export class SuperContainer extends Container {
    constructor() {
        super();

        this.create = new ObjectsFactory(this, resources, styles);
    }
}
