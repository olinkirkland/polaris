import ActionController from '@/controllers/action-controller';
import { ActionType, BaseAction } from './base-action';

export class StartSceneAction extends BaseAction {
    type = ActionType.SCENE;

    id: string; // Scene Id

    static unpack(data: any): StartSceneAction {
        const a = new StartSceneAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        super.act();
        ActionController.getInstance().broadcast(this);
    }
}
