import { ActionType, BaseAction } from './base-action';

export class StartSceneAction extends BaseAction {
    type: ActionType.START_SCENE;

    id: string;

    static unpack(data: any): StartSceneAction {
        const a = new StartSceneAction();
        Object.assign(a, data);
        return a;
    }
}
