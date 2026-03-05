import OnboardingHeritageModal from '@/components/modals/templates/onboarding-heritage-modal.vue';
import OnboardingNameModal from '@/components/modals/templates/onboarding-name-modal.vue';
import OnboardingPathModal from '@/components/modals/templates/onboarding-path-modal.vue';
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
            case 'onboarding-name':
                ModalController.open(OnboardingNameModal);
                break;
            case 'onboarding-heritage':
                ModalController.open(OnboardingHeritageModal);
                break;
            case 'onboarding-path':
                ModalController.open(OnboardingPathModal);
                break;
        }

        super.act();
    }
}
