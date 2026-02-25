import { ActionType, BaseAction } from './base-action';
import { GoToAtlasAction } from './go-to-atlas';
import { GoToZoneAction } from './go-to-zone';
import { PatchStateAction } from './patch-state';
import { StartSceneAction } from './start-scene';

export function makeAction(data: any): BaseAction {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.GO_TO_ATLAS:
            return GoToAtlasAction.unpack(data);
        case ActionType.GO_TO_ZONE:
            return GoToZoneAction.unpack(data);
        case ActionType.START_SCENE:
            return StartSceneAction.unpack(data);
        case ActionType.PATCH_STATE:
            return PatchStateAction.unpack(data);
    }

    return data as BaseAction;
}
