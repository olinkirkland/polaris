import { Stat, StatsRegister } from '@/stats/stats-register';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    id: string;
    name: string;
    characterPathId: string;
    stats: StatsRegister;

    constructor() {
        // Attributes
        this.stats.registerStat(new Stat('brawn'));
        this.stats.registerStat(new Stat('agility'));
        this.stats.registerStat(new Stat('wits'));
        this.stats.registerStat(new Stat('aura'));

        // Skills
        this.stats.registerStat(new Stat('prowess'));
        this.stats.registerStat(new Stat('endurance'));
        this.stats.registerStat(new Stat('skirmish'));
        this.stats.registerStat(new Stat('evasion'));
        this.stats.registerStat(new Stat('reflex'));
        this.stats.registerStat(new Stat('tinker'));
        this.stats.registerStat(new Stat('medicine'));
        this.stats.registerStat(new Stat('focus'));
        this.stats.registerStat(new Stat('conduit'));
        this.stats.registerStat(new Stat('insight'));

        // Core
        this.stats.registerStat(new Stat('health'));
        this.stats.registerStat(new Stat('mana'));
        this.stats.registerStat(new Stat('defense'));
        this.stats.registerStat(new Stat('criticalChance'));
        this.stats.registerStat(new Stat('criticalDamageMultiplier'));
        this.stats.registerStat(new Stat('guard'));
        this.stats.registerStat(new Stat('barrier'));
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
