import escapeTheShip from '@/assets/data/quests/escape-the-ship';
import { Quest } from './story-types';

export const quests: Quest[] = [];

// Game State
// What quests are active?
// What flags are set?
// What counters exist, and at what values?

export function registerQuest(quest: Quest) {
    quests.push(quest);
}

export async function setupQuests() {
    // const response = await fetch('/assets/data/quests/main.json');
    // const questData = await response.json();
    // registerQuest(questData);
    registerQuest(escapeTheShip);
}
