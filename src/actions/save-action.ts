import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

export class SaveAction extends BaseAction {
    type = ActionType.SAVE;

    static unpack(data: any): SaveAction {
        const a = new SaveAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        useGameStateStore().save('autosave', 'Autosave');
        super.act();
    }
}
