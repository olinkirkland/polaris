export enum ActionType {
    WAIT = 'wait',
    ZONE = 'go-to-zone',
    ATLAS = 'go-to-atlas'
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

    static from(data: any): GoToZoneAction {
        const a = new GoToZoneAction();
        Object.assign(a, data);
        return a;
    }
}

export class GoToZoneAction implements Action {
    type: ActionType.ZONE;

    id: string;

    act() {
        console.log('Open the Zone', this.id);
    }

    static from(data: any): GoToZoneAction {
        const a = new GoToZoneAction();
        Object.assign(a, data);
        return a;
    }
}

export class GoToAtlasAction {
    type: ActionType.ATLAS;

    x: number;
    y: number;
    z: number;

    act() {
        console.log('Open the Atlas');
    }

    static from(data: any): GoToAtlasAction {
        const a = new GoToAtlasAction();
        Object.assign(a, data);
        return a;
    }
}
