import { ActionType, BaseAction } from './base-action';

export class GoToAtlasAction extends BaseAction {
    type: ActionType.GO_TO_ATLAS;

    x: number;
    y: number;
    z: number;

    static unpack(data: any): GoToAtlasAction {
        const a = new GoToAtlasAction();
        Object.assign(a, data);
        return a;
    }
}
