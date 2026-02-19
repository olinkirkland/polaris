import ActionController from '@/controllers/action-controller';

export enum ActionType {
    GO_TO_ZONE = 'go-to-zone',
    GO_TO_ATLAS = 'go-to-atlas'
}

export abstract class BaseAction {
    abstract type: string;
    act() {
        ActionController.emit(this);
    }
}
