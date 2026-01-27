export enum ActionType {
    ZONE = 'zone',
    ATLAS = 'atlas'
}

export interface Action {
    type: ActionType;
    act(): void;
}

export class ZoneAction implements Action {
    type: ActionType.ZONE;
    act() {
        console.log('Open the Zone');
    }
}

export class AtlasAction {
    type: ActionType.ATLAS;
    act() {
        console.log('Open the Atlas');
    }
}
