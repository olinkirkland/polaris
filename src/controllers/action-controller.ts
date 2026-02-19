import { BaseAction } from '@/actions/base-action';
import { Subject } from 'rxjs';

export default class ActionController {
    private static instance: ActionController | null = null;
    private subject: Subject<BaseAction> = new Subject<BaseAction>();

    public static emit(action: BaseAction): void {
        this.getInstance().dispatch(action);
    }

    private constructor() {}

    public static getInstance(): ActionController {
        return this.instance || (this.instance = new this());
    }

    private dispatch(d: BaseAction): void {
        this.subject.next(d);
    }

    public addEventListener(callback: (d: BaseAction) => void): void {
        this.subject.subscribe(callback);
    }

    public removeEventListener(): void {
        this.subject.unsubscribe();
    }
}
