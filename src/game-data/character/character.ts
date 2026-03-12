import { ModifierStack, Modifier } from '@/game-data/character/modifier-stack';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    id: string;
    name: string;
    characterPathId: string;

    properties: {
        health: ModifierStack;
        mana: ModifierStack;
        defense: ModifierStack;
        criticalChance: ModifierStack;
        criticalDamageMultiplier: ModifierStack;
        guard: ModifierStack;
        barrier: ModifierStack;

        // Resistances
        slashingResistance: ModifierStack;
        piercingResistance: ModifierStack;
        bludgeoningResistance: ModifierStack;
        fireResistance: ModifierStack;
        coldResistance: ModifierStack;
        energyResistance: ModifierStack;
        poisonResistance: ModifierStack;
        psychicResistance: ModifierStack;
    };

    attributes: {
        brawn: ModifierStack;
        agility: ModifierStack;
        wits: ModifierStack;
        aura: ModifierStack;
    };

    skills: {
        prowess: ModifierStack;
        endurance: ModifierStack;
        skirmish: ModifierStack;
        evasion: ModifierStack;
        reflex: ModifierStack;
        tinker: ModifierStack;
        medicine: ModifierStack;
        focus: ModifierStack;
        conduit: ModifierStack;
        insight: ModifierStack;
    };

    get characterPath() {
        return useGameDataStore().data?.characterPaths.find((p) => p.id === this.characterPathId);
    }
}
