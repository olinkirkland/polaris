import { makeAction } from '@/actions/action-factory';
import { BaseAction } from '@/actions/base-action';
import { useGameStateStore } from '@/store/game-state-store';
import { Condition, evaluateCondition } from './condition';

export type QuestState = {
    id: string;
    activeNodeId: string;
    traversedNodeIds: string[];
};

export type QuestOption = {
    condition: Condition;
    nodeId: string;
};

export class QuestNode {
    id: string;
    label: string;
    description: string;
    actions: BaseAction[];
    edges: QuestOption[];

    static unpack(data: any): QuestNode {
        const n = new QuestNode();
        n.id = data.id;
        n.label = data.label;
        n.description = data.description;
        n.actions = data.actions.map((a: any) => makeAction(a));
        n.edges = data.edges
            ? data.edges.map((e: any) => {
                  return { condition: e.condition, nodeId: e.nodeId };
              })
            : [];

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
        // Starting condition; only care if there's no activeNode (hasn't been started yet)
        if (!this.getActiveNode() && evaluateCondition(this.condition)) {
            console.log('@quest.validate:', '[started]', this.id);
            this.gameState.setActiveNodeId(this.id, this.entryNode.id);
        }

        // Condition to advance the activeNode along its edges
        this.getActiveNode()?.edges.forEach((e) => {
            if (evaluateCondition(e.condition)) {
                console.log('@quest.validate:', '[advanced]', this.id, e.nodeId);
                this.gameState.setActiveNodeId(this.id, e.nodeId);
            }
        });
    }

    getActiveNode(): QuestNode | undefined {
        const activeNodeId = this.gameState.getActiveNodeId(this.id);
        if (!activeNodeId) return undefined;
        return this.getNode(activeNodeId);
    }
}
