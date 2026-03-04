import { useGameStateStore } from '@/store/game-state-store';

// The top-level type: Always a group at the root
export type Condition = AndCondition | OrCondition | NotCondition | LeafCondition;

interface AndCondition {
    type: 'AND';
    conditions: Condition[];
}

interface OrCondition {
    type: 'OR';
    conditions: Condition[];
}

interface NotCondition {
    type: 'NOT';
    condition: Condition;
}

// The actual checks
type LeafCondition = FlagCondition;
// SkillCondition
// AttributeCondition
// QuestCondition
// EnemyDefeatedCondition
// LocationVisitedCondition
// ItemAcquiredCondition

interface FlagCondition {
    type: 'FLAG';
    flag: string;
    op: 'EQ' | 'NEQ' | 'GT' | 'LT' | 'GTE' | 'LTE';
    value: boolean | number | string;
}

export function evaluateCondition(c: Condition): boolean {
    const gameState = useGameStateStore();
    switch (c.type) {
        case 'AND':
            return c.conditions.every((d) => evaluateCondition(d));
        case 'OR':
            return c.conditions.every((d) => evaluateCondition(d));
        case 'NOT':
            return !evaluateCondition(c.condition);
        case 'FLAG':
            return applyOp(gameState.getValue('flags')[c.flag], c.op, c.value);
    }
}

function applyOp(
    actual: boolean | number | string | undefined,
    op: string,
    expected: boolean | number | string
): boolean {
    switch (op) {
        case 'EQ':
            return actual === expected;
        case 'NEQ':
            return actual !== expected;
        case 'GT':
            return Number(actual) > Number(expected);
        case 'LT':
            return Number(actual) < Number(expected);
        case 'GTE':
            return Number(actual) >= Number(expected);
        case 'LTE':
            return Number(actual) <= Number(expected);
        default:
            return false;
    }
}
