import {Assets} from "pixi.js";

const Styles = {
    panelValue: {
        fontFamily: 'AldotheApache',
        fontSize: 36,
        fill: 0xFFFFFF,
        align: 'center',
    },
    loadingText: {
        fontFamily: 'AldotheApache',
        fontSize: 100,
        fill: 0xFFFFFF,
        align: 'center',
    }
};

export const styles = {
    get: (name)  => {
        return Styles[name];
    }
};
