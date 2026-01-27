import { Action } from '@/actions/action';
import { makeAction } from '@/actions/action-factory';
import { Point } from '@/util/math-util';

export class Pin {
    id: string;
    point: Point;
    label: string;
    actions: Action[];

    constructor() {}

    static from(data: any): Pin {
        const p = new Pin();
        p.id = data.id;
        p.point = data.point;
        p.label = data.label;
        p.actions = data.actions.map((a: any) => makeAction(a));
        return p;
    }
}
