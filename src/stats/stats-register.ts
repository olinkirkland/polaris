// Add stats to the StatsRegister
// Add modifiers to the StatsRegister
// StatsRegister manages the modifiers internally, ensuring each stat has an up-to-date value
// StatsRegister exposes addModifier, removeModifierById, and removeModifiersBySource

export class Modifier {
    target: string;
    getStat: Function; // Callback to the parent StatsRegister

    statPointer?: string;
    rawValue?: number;

    op: 'SUM' | 'PERCENT'; // Flat values (+) get added to the base value first, and percentages (%) get summed separately and applied at the end, all at once. Total number is rounded down to the nearest integer.
    source: string; // The modifier stores the id of the source, for instance a skill, etc.

    get value() {
        return this.statPointer ? this.getStat(this.statPointer).value : this.rawValue; // Returns either the raw value that was provided, or the value of another stat
    }
}

export class Stat {
    id: string;
    modifiers: Modifier[];
    dirty: boolean;

    constructor(id: string) {
        this.id = id;
        this.modifiers = [];
    }

    get value() {
        let flatSum = 0;
        let percentSum = 0;

        this.modifiers.forEach((m) => {
            if (m.op === 'SUM') flatSum += m.value;
            if (m.op === 'PERCENT') percentSum += m.value;
        });

        // Apply flat modifiers, then percentages, then floor
        const finalValue = flatSum * (1 + percentSum / 100);
        return Math.floor(finalValue);
    }

    addModifier(modifier: Modifier) {
        this.modifiers.push(modifier);
    }
}

export class StatsRegister {
    stats: Stat[];

    registerStat(stat: Stat) {}
    addModifiers(modifiers: Modifier[]) {}
    removeModifierById(id: string) {}
    removeModifiersBySourceId(sourceId: string) {}
}

// What are some situations in which a modifier gets added or removed?
// Always store/load all of the modifiers themselves.
// Most obvious examples are equipping/unequipping an item, or loading the game with the item equipped.

// Let's design some items.

// name: Worn Leather Boots
// id: ud0-d99 // This id refers to an INSTANCE of these boots, so it will always be unique to this pair
// Modifiers:
// 1. +20 Guard
// 2. +8 Health

// 50 Guard is the character's base guard (already added via a modifier). So they now have 50+20 = 70 guard

// That's straightforward: Upon equipping them, two Modifiers would be added to the StatsRegister.
// The StatsRegister then must ensure the Modifiers get added to the correct stats (Guard and Health)
// However, what if I get a perk that gives me +10% Guard from items?
// I expect that somehow the +20 Guard becomes +22, and they end up getting 50 + 22 = 72

// Solution is, there needs to be an intermediate stat called "GuardFromGear" that Guard adds.
// building out a preexisting graph that defines the relationships between some stats.
// Next steps should be to build out that graph and determine what the "intermediate stats" should be.
// Idea: Use index cards to represent the stats, and actions.

// How do I mark a stat as "invalidated" and force others to validate?
// In my system, stats keep track of a list of their modifiers, which may contain references to other stats.
// I don't keep track of what modifiers are using a stat (that would get clunky fast). So how can I notify a "dependent" stat upstream that a stat in a modifier it relies on has changed?

// From Google AI answer:

// The Workflow:
// Dependency Mapping: TotalGuard depends on BaseGuard and GuardFromGear.
// Add/Remove Mod: You add a +20 modifier to GuardFromGear.
// Set Dirty: GuardFromGear sets its own isDirty flag to true and invokes an OnStatChanged event.
// Notify Upstream: TotalGuard listens to GuardFromGear.OnStatChanged. Upon receiving the event, TotalGuard sets its own isDirty flag to true.
// Recalculate: When the game requests TotalGuard.Value, it checks if isDirty is true. If yes, it recalculates using the new GuardFromGear value and sets isDirty to false.

// the last point is important: Recalculations only happen when the value is checked. I don't want that. I want it to recalculate and I want a clean graph immediately.

// Question: What's a situation in which I will need removeModifierbyId, and not removeModifierBySourceId?
// Or rather, modifiers get added in "groups" or "Batches", is anotehr way to think about it. And I never want to get rid of just one modifier, I want to remove the whole group
// Like uninstalling software: I don't want to just get rid of one file and keep the rest, as long as modifier groups can't be changed. Should I add a new layer to this concept for modifier groups?
// Maybe there are some weapon or damage effects that disappear while others are still there? Like receiving an effect that makes attacks on your guard do more damage for 5 turns and decreases your hp regen for 2 turns?
// Those would have to be individually removed. But wouldn't I just register different "source-ids" or modifier groups whenever that sort of situation is initiated? Should I worry about it for now
// I fear I'm either over or underengineering this part, and it's gonna bite me later.