import { Point } from '@/util/math-util';
import { ActionType, BaseAction } from './base-action';
import { useGameStateStore } from '@/store/game-state-store';

export class GoToAtlasAction extends BaseAction {
    type = ActionType.GO_TO_ATLAS;

    point: Point;

    static unpack(data: any): GoToAtlasAction {
        const a = new GoToAtlasAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        const state = useGameStateStore();
        state.setValue('zone', null);
        state.setValue('atlas-coordinates', this.point);

        super.act();
    }
}
