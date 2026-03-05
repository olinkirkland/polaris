import ActionController from '@/controllers/action-controller';

export enum ActionType {
    ONBOARDING = 'onboarding',
    AUTOSAVE = 'autosave',
    GO_TO_ZONE = 'go-to-zone',
    GO_TO_ATLAS = 'go-to-atlas',
    START_SCENE = 'start-scene',
    PATCH_STATE = 'patch-state',
    USER_INTERFACE = 'user-interface'
}

export abstract class BaseAction {
    abstract type: string;

    act() {
        console.log('@act:', this.type);
        ActionController.getInstance().add(this);
    }
}
