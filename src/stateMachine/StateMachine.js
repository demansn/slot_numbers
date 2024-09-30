export class StateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    addStates(states, params = {}) {
        for (let name in states) {
            this.addState(name, new states[name]({parent: this, name, ...params}));
        }
    }

    addState(name, state) {
        this.states[name] = state;
    }

    gotoState(name, params = null) {
        if (this.currentState) {
            this.currentState.onLeave();
        }

        this.currentState = this.states[name];
        this.currentState.onEnter(params);
    }
}
