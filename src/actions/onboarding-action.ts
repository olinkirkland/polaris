import ModalController from '@/controllers/modal-controller';
import { Point } from '@/util/math-util';
import { ActionType, BaseAction } from './base-action';
import OnboardingModal from '@/components/modals/templates/onboarding-modal.vue';

export class StartOnboardingAction extends BaseAction {
    type = ActionType.ONBOARDING;

    point: Point;

    static unpack(data: any): StartOnboardingAction {
        const a = new StartOnboardingAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        ModalController.open(OnboardingModal);
        super.act();
    }
}
