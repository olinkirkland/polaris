import { AttributeModifier } from '@/game-data/attribute';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    id: string;
    name: string;
    characterPathId: string;
    attributeModifiers: AttributeModifier[];

    get characterPath() {
        console.log('characterPath', this.characterPathId);
        return useGameDataStore().data?.characterPaths.find((p) => p.id === this.characterPathId);
    }
}
