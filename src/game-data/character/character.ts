import { Stat, StatsRegister } from '@/stats/stats-register';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    id: string;
    name: string;
    characterPathId: string;
    stats: StatsRegister;

    // Points can be spent on upgrades
    attributePoints: number;
    skillPoints: number;
    talentPoints: number;

    constructor() {
        this.stats = new StatsRegister();

        // Attributes
        this.stats.register(new Stat('brawn'));
        this.stats.register(new Stat('agility'));
        this.stats.register(new Stat('wits'));
        this.stats.register(new Stat('aura'));

        // Skills
        this.stats.register(new Stat('prowess'));
        this.stats.register(new Stat('endurance'));
        this.stats.register(new Stat('skirmish'));
        this.stats.register(new Stat('evasion'));
        this.stats.register(new Stat('reflex'));
        this.stats.register(new Stat('tinker'));
        this.stats.register(new Stat('medicine'));
        this.stats.register(new Stat('focus'));
        this.stats.register(new Stat('conduit'));
        this.stats.register(new Stat('insight'));

        // Core
        this.stats.register(new Stat('health'));
        this.stats.register(new Stat('mana'));
        this.stats.register(new Stat('defense'));
        this.stats.register(new Stat('criticalChance'));
        this.stats.register(new Stat('criticalDamageMultiplier'));
        this.stats.register(new Stat('guard'));
        this.stats.register(new Stat('barrier'));

        // Points
        this.attributePoints = 0;
        this.talentPoints = 0;
        this.skillPoints = 0;
    }

    pack() {
        return {
            id: this.id,
            name: this.name,
            characterPathId: this.characterPathId,
            stats: this.stats.pack(),
            attributePoints: this.attributePoints,
            skillPoints: this.skillPoints,
            talentPoints: this.talentPoints
        };
    }

    static unpack(data: ReturnType<Character['pack']>): Character {
        const c = new Character(); // constructor registers all stats
        c.id = data.id;
        c.name = data.name;
        c.characterPathId = data.characterPathId;
        c.stats = StatsRegister.unpack(data.stats); // restores modifiers
        c.attributePoints = data.attributePoints;
        c.skillPoints = data.skillPoints;
        c.talentPoints = data.talentPoints;
        return c;
    }

    // slashingResistance: ModifierStack;
    // piercingResistance: ModifierStack;
    // bludgeoningResistance: ModifierStack;
    // fireResistance: ModifierStack;
    // coldResistance: ModifierStack;
    // energyResistance: ModifierStack;
    // poisonResistance: ModifierStack;
    // psychicResistance: ModifierStack;

    get characterPath() {
        return useGameDataStore().data?.characterPaths.find((p) => p.id === this.characterPathId);
    }
}
