import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

export type PatchOperation = 'sum' | 'replace';

export class PatchStateAction extends BaseAction {
    type = ActionType.PATCH_STATE;

    op: PatchOperation = 'replace';
    path: string;
    value: any;

    options?: {
        max?: number; // Number can only go up to this
        min?: number; // Number can only go down to this
    };

    static unpack(data: any): PatchStateAction {
        const a = new PatchStateAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        const gameState = useGameStateStore();
        switch (this.op) {
            case 'sum':
                gameState.patchValue(this.path, (n) => {
                    let v = n + this.value;
                    if (this.options?.max !== undefined) v = Math.min(v, this.options?.max);
                    if (this.options?.min !== undefined) v = Math.max(v, this.options?.min);
                });
                break;
            case 'replace':
                gameState.setValue(this.path, this.value);
                break;
        }

        super.act();
    }
}
