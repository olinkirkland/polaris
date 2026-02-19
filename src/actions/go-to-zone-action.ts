import { ActionType, BaseAction } from './base-action';

export class GoToZoneAction extends BaseAction {
    type: ActionType.GO_TO_ZONE;

    id: string;

    static unpack(data: any): GoToZoneAction {
        const a = new GoToZoneAction();
        Object.assign(a, data);
        return a;
    }
}
