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

// TODO move this into a JSON (gameData)
// const rewards = [
//     { talentPoints: 1, attributePoints: 2, skillPoints: 2 },
//     { skillPoints: 2 },
//     { talentPoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1, attributePoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1, attributePoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1, attributePoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1 },
//     { skillPoints: 2 },
//     { talentPoints: 1, attributePoints: 1 }
// ];
