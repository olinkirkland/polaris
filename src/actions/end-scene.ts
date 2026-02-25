import { ActionType, BaseAction } from './base-action';

export class EndSceneAction extends BaseAction {
    type = ActionType.END_SCENE;

    static unpack(data: any): EndSceneAction {
        const a = new EndSceneAction();
        Object.assign(a, data);
        return a;
    }
}
