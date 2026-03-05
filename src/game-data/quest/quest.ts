import { BaseAction } from '@/actions/base-action';
import { useGameStateStore } from '@/store/game-state-store';
import { Condition, evaluateCondition } from './condition';
import { makeAction } from '@/actions/action-factory';

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
    actions: BaseAction[];
    edges: QuestOption[];

    static unpack(data: any): QuestNode {
        const n = new QuestNode();
        n.id = data.id;
        n.actions = data.actions.map((a: any) => makeAction(a));
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
        // Starting condition
        if (evaluateCondition(this.condition)) {
            console.log('@quest.validate', this.id);
            this.setActiveNode(this.entryNode.id);
        }

        // Condition to change the activeNode from the edges
        this.getActiveNode().edges.forEach((e) => {
            if (evaluateCondition(e.condition)) {
                console.log('@quest.validate', this.id, e.nodeId);
                this.setActiveNode(e.nodeId);
            }
        });
    }

    setActiveNode(id: string) {
        console.log('@quest.setActiveNode()', this.id, id);
        this.gameState.setActiveNode(this.id, id);
    }

    getActiveNode(): QuestNode {
        return this.getNode(this.gameState.getActiveNode(this.id))!;
    }
}
