import { Action, ActionType, GoToAtlasAction, WaitAction, GoToZoneAction } from './action';

export function makeAction(data: any): Action {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.WAIT: {
            return WaitAction.from(data);
        }
        case ActionType.ATLAS: {
            return GoToAtlasAction.from(data);
        }
        case ActionType.ZONE: {
            return GoToZoneAction.from(data);
        }
    }

    return data as Action;
}
