import { useGameStateStore } from '@/store/game-state-store';
import { ActionType, BaseAction } from './base-action';

type PatchOperation = 'add-to-array' | 'remove-from-array' | 'add-number' | 'multiply-number' | 'replace';

export class PatchStateAction extends BaseAction {
    type = ActionType.PATCH_STATE;

    op: PatchOperation;
    path: string;
    value: any;

    options?: {
        maxNumber?: number; // Number can only go up to this
        minNumber?: number; // Number can only go down to this
        skipDuplicates?: boolean; // Only add to an array if the item isn't there
        removeCount?: number; // Number of matching items to remove from the array
    };

    static unpack(data: any): PatchStateAction {
        const a = new PatchStateAction();
        Object.assign(a, data);
        return a;
    }

    override act() {
        const state = useGameStateStore();
        switch (this.op) {
            case 'add-to-array':
                state.patchValue(this.path, (a) => {
                    return !this.options?.skipDuplicates || !(a as any[]).some(this.value) ? [...a, this.value] : a;
                });
                break;
            case 'remove-from-array':
                const removeCount = this.options?.removeCount || Number.POSITIVE_INFINITY; // Default is to remove all items
                state.patchValue(this.path, (a) => {
                    const r = [...a];
                    for (let i = 0; i < removeCount; i++) {
                        const indexToRemove = r.indexOf(this.value);
                        if (indexToRemove < 0) break;
                        r.splice(indexToRemove, 1);
                    }
                    return r;
                });
                break;
            case 'add-number':
                state.patchValue(this.path, (n) => {
                    let v = n + this.value;
                    if (this.options?.maxNumber !== undefined) v = Math.min(v, this.options?.maxNumber);
                    if (this.options?.minNumber !== undefined) v = Math.max(v, this.options?.minNumber);
                });
                break;
            case 'multiply-number':
                state.patchValue(this.path, (n) => n * this.value);
                break;
            case 'replace':
                state.setValue(this.path, this.value);
                break;
        }

        super.act();
    }
}
