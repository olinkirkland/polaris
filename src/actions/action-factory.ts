import { ActionType, BaseAction } from './base-action';
import { GoToAtlasAction } from './go-to-atlas-action';
import { GoToZoneAction } from './go-to-zone-action';

export function makeAction(data: any): BaseAction {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.GO_TO_ATLAS: {
            return GoToAtlasAction.unpack(data);
        }
        case ActionType.GO_TO_ZONE: {
            return GoToZoneAction.unpack(data);
        }
    }

    return data as BaseAction;
}
