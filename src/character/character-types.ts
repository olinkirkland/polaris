export type Talent = {
    id: string;
    name: string;
    description: string;
};

export type Stat = 'brawn' | 'agility' | 'wits' | 'presence';

export type Character = {
    id: string;
    name: string;
    level: number;
    look: {
        hairTypeId: string;
        hairColor: string;
        skinColor: string;
        equippedClothing: Item;
        equippedArmorItems: Item[];
    };
    stats: {
        [key in Stat]?: number;
    };
    talents: Talent[];
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
