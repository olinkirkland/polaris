import { AttributeModifier } from '@/game-data/attribute';
import { useGameDataStore } from '@/store/game-data-store';

export type Heritage = {
    id: string;
    label: string;
    description: string;
};

export class Character {
    id: string;
    name: string;
    characterPathId: string;
    heritageId: string;
    attributeModifiers: AttributeModifier[];

    get characterPath() {
        return useGameDataStore().data?.characterPaths.find((p) => p.id === this.characterPathId);
    }

    get heritage() {
        return useGameDataStore().data?.characterHeritages.find((h) => h.id === this.heritageId);
    }
}
