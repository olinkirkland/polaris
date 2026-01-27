import { Action, ActionType, AtlasAction, WaitAction, ZoneAction } from './action';

export function makeAction(data: any): Action {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.WAIT: {
            return WaitAction.from(data);
        }
        case ActionType.ATLAS: {
            return AtlasAction.from(data);
        }
        case ActionType.ZONE: {
            return ZoneAction.from(data);
        }
    }

    return data as Action;
}
