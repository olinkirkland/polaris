import ModalController from '@/controllers/modal-controller';
import { ActionType, BaseAction } from './base-action';
import SceneModal from '@/components/modals/templates/scene-modal.vue';

export class StartSceneAction extends BaseAction {
    type = ActionType.START_SCENE;

    id: string; // Scene Id

    static unpack(data: any): StartSceneAction {
        const a = new StartSceneAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        ModalController.open(SceneModal, { id: this.id });
        super.act();
    }
}
