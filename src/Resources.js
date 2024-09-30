import {Assets} from "pixi.js";

export const resources = {
    get: (name)  => {
        return Assets.get(name);
    }
};
