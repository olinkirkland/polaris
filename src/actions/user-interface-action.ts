import OnboardingModal from '@/components/modals/templates/onboarding-modal.vue';
import ModalController from '@/controllers/modal-controller';
import { ActionType, BaseAction } from './base-action';

export class UserInterfaceAction extends BaseAction {
    type = ActionType.USER_INTERFACE;

    id: string;

    static unpack(data: any): UserInterfaceAction {
        const a = new UserInterfaceAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        switch (this.id) {
            case 'onboarding':
                ModalController.open(OnboardingModal);
                break;
        }

        super.act();
    }
}
