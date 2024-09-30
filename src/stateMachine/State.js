import {StateMachine} from "./StateMachine.js";

export default class State extends StateMachine {
    constructor({name, parent}) {
        super();

        this.name = name;
        this.parent = parent;
    }
    onEnter(params = null) {}
    onLeave() {}
}
