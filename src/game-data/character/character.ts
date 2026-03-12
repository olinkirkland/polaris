import { CalculatedStat, StatsRegister } from '@/stats/stats-register';
import { useGameDataStore } from '@/store/game-data-store';

export class Character {
    id: string;
    name: string;
    characterPathId: string;
    stats: StatsRegister;

    constructor() {
        // Attributes
        this.stats.registerStat(new CalculatedStat('brawn'));
        this.stats.registerStat(new CalculatedStat('agility'));
        this.stats.registerStat(new CalculatedStat('wits'));
        this.stats.registerStat(new CalculatedStat('aura'));

        // Skills
        this.stats.registerStat(new CalculatedStat('prowess'));
        this.stats.registerStat(new CalculatedStat('endurance'));
        this.stats.registerStat(new CalculatedStat('skirmish'));
        this.stats.registerStat(new CalculatedStat('evasion'));
        this.stats.registerStat(new CalculatedStat('reflex'));
        this.stats.registerStat(new CalculatedStat('tinker'));
        this.stats.registerStat(new CalculatedStat('medicine'));
        this.stats.registerStat(new CalculatedStat('focus'));
        this.stats.registerStat(new CalculatedStat('conduit'));
        this.stats.registerStat(new CalculatedStat('insight'));

        // Core
        this.stats.registerStat(new CalculatedStat('health'));
        this.stats.registerStat(new CalculatedStat('mana'));
        this.stats.registerStat(new CalculatedStat('defense'));
        this.stats.registerStat(new CalculatedStat('criticalChance'));
        this.stats.registerStat(new CalculatedStat('criticalDamageMultiplier'));
        this.stats.registerStat(new CalculatedStat('guard'));
        this.stats.registerStat(new CalculatedStat('barrier'));
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
