export enum ActionType {
    WAIT = 'wait',
    ZONE = 'zone',
    ATLAS = 'atlas'
}

export interface Action {
    type: ActionType;
    act(): void;
}

export class WaitAction implements Action {
    type: ActionType.WAIT;

    seconds: number;

    act() {
        console.log('Waiting for', this.seconds, 'seconds');
    }

    static from(data: any): ZoneAction {
        const a = new ZoneAction();
        Object.assign(a, data);
        return a;
    }
}

export class ZoneAction implements Action {
    type: ActionType.ZONE;

    id: string;

    act() {
        console.log('Open the Zone', this.id);
    }

    static from(data: any): ZoneAction {
        const a = new ZoneAction();
        Object.assign(a, data);
        return a;
    }
}

export class AtlasAction {
    type: ActionType.ATLAS;

    x: number;
    y: number;
    z: number;

    act() {
        console.log('Open the Atlas');
    }

    static from(data: any): AtlasAction {
        const a = new AtlasAction();
        Object.assign(a, data);
        return a;
    }
}
