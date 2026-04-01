import { Modifier } from '@/stats/stats-register';
import { useGameDataStore } from '@/store/game-data-store';

export type LevelReward = {
    talentPoints?: number;
    attributePoints?: number;
    skillPoints?: number;
    modifiers?: Modifier[];
};

export function getExperienceToNextLevel(currentLevel: number): number {
    return useGameDataStore().data?.experienceRequiredPerLevel[currentLevel] || 0;
}
