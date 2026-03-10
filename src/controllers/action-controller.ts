import { ActionType, BaseAction } from '@/actions/base-action';
import { Subject } from 'rxjs';

export default class ActionController {
    private static instance: ActionController | null = null;
    private subject: Subject<BaseAction> = new Subject<BaseAction>();

    private constructor() {}

    public static getInstance(): ActionController {
        return this.instance || (this.instance = new this());
    }

    public broadcast(d: BaseAction): void {
        console.log('@broadcast', d);
        this.subject.next(d);
    }

    public addEventListener(type: ActionType, callback: (d: BaseAction) => void): void {
        this.subject.subscribe((action) => {
            if (action.type === type) callback(action);
        });
    }

    public removeEventListener(): void {
        this.subject.unsubscribe();
    }
}
