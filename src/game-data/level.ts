type LevelReward = {
    talentPoints?: number;
    attributePoints?: number;
    skillPoints?: number;
};

// TODO move this into a JSON (gameData)
const rewards = [
    { talentPoints: 1, attributePoints: 2, skillPoints: 2 },
    { skillPoints: 2 },
    { talentPoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1, attributePoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1, attributePoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1, attributePoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1 },
    { skillPoints: 2 },
    { talentPoints: 1, attributePoints: 1 }
];

export function getRewardsForLevel(level: number): LevelReward {
    if (level >= rewards.length) return {};
    return rewards[level];
}

export function getExperienceToNextLevel(currentLevel: number): number {
    return 200 + currentLevel * 15;
}
