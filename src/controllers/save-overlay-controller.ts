import { Subject } from 'rxjs';

export interface SaveOverlayDispatch {
    visible: boolean;
    message?: string;
}

export default class SaveOverlayController {
    private static instance: SaveOverlayController | null = null;
    private subject: Subject<SaveOverlayDispatch> = new Subject<SaveOverlayDispatch>();

    public static open(message?: string): void {
        this.getInstance().dispatch({ visible: true, message });
    }

    public static close(): void {
        this.getInstance().dispatch({ visible: false });
    }

    private constructor() {}

    public static getInstance(): SaveOverlayController {
        return this.instance || (this.instance = new this());
    }

    private dispatch(d: SaveOverlayDispatch): void {
        this.subject.next(d);
    }

    public addEventListener(callback: (d: SaveOverlayDispatch) => void): void {
        this.subject.subscribe(callback);
    }

    public removeEventListener(): void {
        this.subject.unsubscribe();
    }
}
