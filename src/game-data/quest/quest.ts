import { useGameStateStore } from '@/store/game-state-store';
import { Condition, evaluateCondition } from './condition';

export type QuestState = {
    id: string;
    activeNodeId: string;
};

export type QuestOption = {
    condition: Condition;
    nodeId: string;
};

export class QuestNode {
    id: string;
    edges: QuestOption[];

    static unpack(data: any): QuestNode {
        const n = new QuestNode();
        n.id = data.id;
        n.edges = data.edges.map((e: any) => {
            return { condition: e.condition, nodeId: e.nodeId };
        });

        return n;
    }
}

export class Quest {
    private gameState = useGameStateStore();

    id: string;
    label: string;
    nodes: QuestNode[];
    entryNode: QuestNode;
    condition: Condition;

    static unpack(data: any): Quest {
        const q = new Quest();
        q.id = data.id;
        q.label = data.label;

        q.nodes = data.nodes.map((n: any) => QuestNode.unpack(n));
        q.entryNode = q.getNode(data.entryNode)!;
        q.condition = data.condition;
        return q;
    }

    getNode(id: string) {
        return this.nodes.find((n) => n.id === id);
    }

    validate() {
        // Evaluate the starting condition for the quest
        if (evaluateCondition(this.condition)) {
            console.log('Condition evaluated as true:', this.condition);
            this.activeNode = this.entryNode.id;
        }
    }

    set activeNode(id: string) {
        this.gameState.setActiveNodeId(this.id, id);
    }

    get activeNode(): QuestNode {
        return this.gameState.getActiveNodeId(this.id);
    }
}
