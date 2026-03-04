import { BaseAction } from '@/actions/base-action';
import { Subject } from 'rxjs';

export default class ActionController {
    private static instance: ActionController | null = null;
    private subject: Subject<BaseAction> = new Subject<BaseAction>();
    private queue: BaseAction[] = [];

    private constructor() {}

    public static getInstance(): ActionController {
        return this.instance || (this.instance = new this());
    }

    public add(action: BaseAction): void {
        const instance = ActionController.getInstance();
        instance.queue.push(action);
    }

    public play() {
        // TODO: Organize the queue before playing it

        const next = this.queue.shift();
        next?.act();
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
