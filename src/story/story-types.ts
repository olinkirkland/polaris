export type Quest = {
    id: string;
    title: string;
    description: string;
    currentNodeId: string;
    nodes: Record<string, QuestNode>;
    state: 'active' | 'completed' | 'failed';
};

export type QuestNode = {
    id: string;
    description: string;
    effectsOnEnter: StoryEffect[];
    objectives: QuestObjective[];
    successNodeId?: string; // next node on success
    failureNodeId?: string; // next node on failure
};

export type QuestObjective = {
    description: string;
    conditions: QuestNodeCondition[];
    effectsOnComplete: StoryEffect[];
};

export type QuestNodeCondition =
    | { type: 'flag'; flag: string; value: boolean }
    | { type: 'inventory'; item: string; count?: number }
    | { type: 'stat'; stat: string; min?: number; max?: number }
    | { type: 'location'; locationId: string };

export type StoryEffect =
    | { type: 'setFlag'; flag: string; value: boolean }
    | { type: 'modifyInventory'; item: string; amount: number }
    | { type: 'modifyStat'; stat: string; amount: number }
    | { type: 'changeLocation'; locationId: string }
    | { type: 'progressNode'; nodeId: string };
