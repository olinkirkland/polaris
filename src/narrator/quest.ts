export interface QuestNode {
    id: string;
    description: string;
    type?: 'and' | 'or';
    options?: QuestOption[];
    subNodes?: QuestNode[];
}

export interface QuestOption {
    text: string;
    next?: string; // points to the next QuestNode id
}

export default class Quest {
    public id: string;
    private nodes: Map<string, QuestNode>;
    private currentNodeId?: string;

    private isVisible: boolean = true;
    private isActive: boolean = false;
    private isCompleted: boolean = false;

    constructor(id: string, nodes: QuestNode[]) {
        this.id = id;
        this.nodes = new Map(nodes.map((node) => [node.id, node]));
        this.currentNodeId = nodes[0]?.id;
    }
}
