import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

export class AddPinAction extends BaseAction {
    type = ActionType.PIN;

    id: string;
    op: 'add' | 'remove';

    static unpack(data: any): AddPinAction {
        const a = new AddPinAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        const gameState = useGameStateStore();
        if (this.op === 'add') gameState.addPin(this.id);
        else gameState.removePin(this.id);

        super.act();
    }
}
