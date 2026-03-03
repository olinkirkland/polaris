export type Stat = 'brawn' | 'agility' | 'wits' | 'presence';
export type Skill =
    | 'melee'
    | 'berserk'
    | 'endurance'
    | 'ranged'
    | 'precision'
    | 'evasion'
    | 'tinker'
    | 'medicine'
    | 'attunement'
    | 'inspiration'
    | 'deception'
    | 'ritual';

export type Character = {
    id: string; // A unique id for this character, e.g., 'player' is used for the Player's created character
    name: string; // The character's name, as used in labels in the user interface
    path: string; // The character's path
    level: number; // The character's level
    stats: {
        [key in Stat]?: number;
    };
    skills: {
        [key in Skill]?: number;
    };

    // talents: Talent[];
    // abilities: Ability[];
};

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
        [key in Stat]?: number;
    };
};
