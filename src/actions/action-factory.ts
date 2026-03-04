import { AutosaveAction } from './autosave-action';
import { ActionType, BaseAction } from './base-action';
import { GoToAtlasAction } from './go-to-atlas-action';
import { GoToZoneAction } from './go-to-zone-action';
import { StartOnboardingAction } from './onboarding-action';
import { PatchStateAction } from './patch-state-action';
import { StartSceneAction } from './start-scene-action';

export function makeAction(data: any): BaseAction {
    if (!data.type) throw new Error('Actions must have a type', data);

    switch (data.type) {
        case ActionType.ONBOARDING:
            return StartOnboardingAction.unpack(data);
        case ActionType.AUTOSAVE:
            return AutosaveAction.unpack(data);
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
