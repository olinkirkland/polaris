import { Quest } from './story-types';

export const quests: Quest[] = [];

export function registerQuest(quest: Quest) {
    quests.push(quest);
}

export async function setupQuests() {
    const response = await fetch('/assets/data/quests/main.json');
    const questData = await response.json();
    console.log(questData);
    for (const q of questData) {
        registerQuest(new Quest(q.id, q.nodes));
    }
}
