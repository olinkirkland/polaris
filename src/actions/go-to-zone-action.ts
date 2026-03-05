import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

export class GoToZoneAction extends BaseAction {
    type = ActionType.GO_TO_ZONE;

    id: string; // Zone Id

    static unpack(data: any): GoToZoneAction {
        const a = new GoToZoneAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        const gameState = useGameStateStore();
        gameState.setValue('zone', this.id);

        super.act();
    }
}
