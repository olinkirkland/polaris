import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

export class AutosaveAction extends BaseAction {
    type = ActionType.AUTOSAVE;

    static unpack(data: any): AutosaveAction {
        const a = new AutosaveAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        useGameStateStore().save('autosave', 'Autosave');
        super.act();
    }
}
