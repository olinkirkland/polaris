import { BaseAction } from '@/actions/base-action';
import { makeAction } from '@/actions/action-factory';
import { Point } from '@/util/math-util';

export class Pin {
    id: string;
    address: {
        zone?: string;
        point: Point;
    };
    label: string;
    actions: BaseAction[];

    static unpack(data: any): Pin {
        const p = new Pin();
        p.id = data.id;
        p.address = data.address;
        p.label = data.label;
        p.actions = data.actions.map((a: any) => makeAction(a));
        return p;
    }
}
