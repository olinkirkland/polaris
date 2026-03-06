import { ActionType, BaseAction } from './base-action';
import { GoToAtlasAction } from './go-to-atlas-action';
import { GoToZoneAction } from './go-to-zone-action';
import { PatchStateAction } from './patch-state-action';
import { SaveAction } from './save-action';
import { StartBattleAction } from './start-battle-action';
import { StartSceneAction } from './start-scene-action';
import { UserInterfaceAction } from './user-interface-action';

export function makeAction(data: any): BaseAction {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.SAVE:
            return SaveAction.unpack(data);
        case ActionType.GO_TO_ATLAS:
            return GoToAtlasAction.unpack(data);
        case ActionType.GO_TO_ZONE:
            return GoToZoneAction.unpack(data);
        case ActionType.SCENE:
            return StartSceneAction.unpack(data);
        case ActionType.BATTLE:
            return StartBattleAction.unpack(data);
        case ActionType.PATCH_STATE:
            return PatchStateAction.unpack(data);
        case ActionType.USER_INTERFACE:
            return UserInterfaceAction.unpack(data);
        default:
            throw new Error(`@action-factory: No such ActionType ${data.type}`);
    }
}
