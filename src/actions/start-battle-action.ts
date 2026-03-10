import BattleModal from '@/components/modals/templates/battle-modal.vue';
import ModalController from '@/controllers/modal-controller';
import { ActionType, BaseAction } from './base-action';

export class StartBattleAction extends BaseAction {
    type = ActionType.BATTLE;

    id: string; // Battle Id

    static unpack(data: any): StartBattleAction {
        const a = new StartBattleAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        ModalController.open(BattleModal, { id: this.id });
        super.act();
    }
}
