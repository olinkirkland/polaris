import { AttributeModifier } from '@/game-data/attribute';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    private gameData = useGameDataStore();

    id: string;
    name: string;
    characterPathId: string;
    attributeModifiers: AttributeModifier;

    get characterPath() {
        return this.gameData.data?.characterPaths.find((p) => p.id === this.characterPathId);
    }
}

export type Item = {
    id: string;
    name: string;
    description: string;
    effects: ItemEffect[];
};

// ItemEffect describes a passive effect an Item can have when equipped on a Character.
export type ItemEffect = {
    armor: {
        physical: number; // Adds a flat amount of physical armor
        magic: number; // Adds a flat amount of magic armor
    };

    resistance: {
        physical: number; // Adds a percentage resistance to physical damage
        magic: number; // Adds a percentage resistance to magic damage
    };

    statModifiers: {
        // [key in Stat]?: number;
    };
};
