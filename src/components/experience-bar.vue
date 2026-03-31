<template>
    <i v-if="isLevelUpAvailable" class="fa-solid fa-angles-up fa-fade"></i>
    <span class="flex items-center">
        <span class="mr-2">Level {{ level }}</span>
        <ProgressBar :value="animatedExperience / experienceToNextLevel" />
        <!-- <span class="min-w-28">{{ Math.round(animatedExperience) }} / {{ experienceToNextLevel }} XP</span> -->
    </span>
</template>

<script lang="ts" setup>
import { getExperienceToNextLevel } from '@/game-data/level';
import { useGameStateStore } from '@/store/game-state-store';
import { gsap } from 'gsap';
import { computed, ref, watch } from 'vue';
import ProgressBar from './ui/progress-bar.vue';

const gameState = useGameStateStore();
const level = computed(() => gameState.state.level);
const experience = computed(() => gameState.state.experience);
const experienceToNextLevel = computed(() => getExperienceToNextLevel(level.value));
const isLevelUpAvailable = computed(() =>
    gameState.getParty().some((c) => c.attributePoints + c.skillPoints + c.talentPoints > 0)
);

const animatedExperience = ref(experience.value);

watch(experience, (newExperience, oldExperience) => {
    const toVars = {
        duration: 2,
        value: newExperience,
        ease: 'power3.out'
    };

    if (newExperience < oldExperience) {
        gsap.fromTo(animatedExperience, { value: 0 }, toVars);
    } else {
        gsap.to(animatedExperience, toVars);
    }
});
</script>
