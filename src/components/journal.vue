<template>
    <Card>
        <Card>
            <ul class="flex flex-wrap gap-2">
                <li v-for="(flagValue, flagName) in gameState.getValue('flags')">
                    <Flag :flag-name="flagName.toString()" :flag-value="flagValue" />
                </li>
            </ul>
        </Card>
        <ul class="flex flex-col">
            <li v-for="q in gameData?.data?.quests">
                <Card>
                    <em>{{ q.label }}</em>
                    <ul class="flex flex-col ml-2">
                        <li v-for="n in q.nodes">
                            <strong v-if="n.id === q.getActiveNode().id">
                                <i class="fa-regular fa-circle"></i>
                                {{ n.id }}
                            </strong>
                            <span
                                v-else-if="gameState.getQuest(q.id).traversedNodeIds.includes(n.id)"
                            >
                                <i class="fa-regular fa-circle-check"></i>
                                {{ n.id }}
                            </span>
                            <span v-else>
                                <i class="fa-regular fa-circle"></i>
                                {{ n.id }}</span
                            >
                        </li>
                    </ul>
                </Card>
            </li>
        </ul>
    </Card>
</template>

<script lang="ts" setup>
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import Card from './shared/card.vue';
import Flag from './ui/flag.vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
</script>
