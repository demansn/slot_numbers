import * as PIXI from 'pixi.js';

import {OfflineAPI} from "./api/offline/OfflineAPI.js";
import {Game} from "./Game.js";
import {ServerAPI} from "./api/ServerAPI.js";
import {config} from "./config.js";

const urlParams = new URLSearchParams(window.location.search);

 function init() {
     const url = urlParams.has('api') ? urlParams.get('api') : '';
     const uid = urlParams.has('uid') ? urlParams.get('uid') : 0;
     const api = url ? new ServerAPI({url, uid}) : OfflineAPI.fromBrowser({uid, gameConfig: config});

    Game.from({
        config,
        api,
        uid
    })
}

init();
