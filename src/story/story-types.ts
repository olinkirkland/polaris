export type Quest = {
    id: string;
    title: string;
    currentNodeId: string;
    nodes: QuestNode[];
    state: 'dormant' | 'active' | 'completed' | 'failed';
};

export type QuestNode = {
    id: string;
    description: string;
    effects: StoryEffect[];
    objectives: QuestObjective[];
};

export type QuestObjective = {
    description: string;
    successMode: 'any' | 'all';
    conditionsForSuccess: QuestNodeCondition[];
    effectsOnSuccess: StoryEffect[];
    failMode?: 'any' | 'all';
    conditionsForFail?: QuestNodeCondition[];
    effectsOnFail?: StoryEffect[];
};

export type QuestNodeCondition =
    | { type: 'flag'; flag: string }
    | { type: 'counter'; count: number; comparator: 'lessThan' | 'greaterThan' | 'equalTo' | 'notEqualTo' }
    | { type: 'hasItem'; item: string; count?: number }
    | { type: 'location'; locationId: string };

export type StoryEffect =
    | { type: 'setFlag'; flag: string }
    | { type: 'setCounterRelative'; counter: string; amount: number }
    | { type: 'setCounterAbsolute'; counter: string; amount: number }
    | { type: 'giveItem'; item: string; amount: number }
    | { type: 'removeItem'; item: string; amount: number }
    | { type: 'travel'; locationId: string }
    | { type: 'activateNode'; nodeId: string }
    | { type: 'setMarkerStoryEffect'; markerId: string; effect: StoryEffect[] };

export type Battle = {
    backgroundImage: string; // Identifier for the background image
    characterIds: string[]; // Identifiers for the enemies involved in the battle
};
