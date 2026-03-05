<template>
    <Card>
        <Card>
            <ul class="flex flex-wrap gap-2">
                <li v-for="(flagValue, flagName) in gameState.getValue('flags')">
                    <Flag :flag-name="flagName.toString()" :flag-value="flagValue" />
                </li>
            </ul>
        </Card>
        <ul class="flex flex-col gap-2">
            <li v-for="q in gameData?.data?.quests">
                <Card v-if="gameState.getActiveNodeId(q.id)">
                    <em>{{ q.label }}</em>
                    <div class="grid grid-cols-2">
                        <ul class="flex flex-col ml-2">
                            <li v-for="n in q.nodes">
                                <!-- v-if="n.label.length > 0" -->
                                <span class="flex gap-1">
                                    <!-- Icon -->
                                    <i
                                        class="mt-0.5 fa-regular"
                                        :class="
                                            gameState.getQuest(q.id).traversedNodeIds.includes(n.id) &&
                                            !(n.id === q.getActiveNode()?.id)
                                                ? 'fa-circle-check'
                                                : 'fa-circle'
                                        "
                                    ></i>
                                    <!-- Label -->
                                    <strong v-if="n.id === q.getActiveNode()?.id">{{ n.label }}</strong>
                                    <span v-else-if="gameState.getQuest(q.id).traversedNodeIds.includes(n.id)">
                                        <span class="line-through decoration-1">{{ n.label }}</span>
                                    </span>
                                    <span v-else>{{ n.label }}</span>
                                </span>
                            </li>
                        </ul>
                        <p>{{ q.getActiveNode()?.description }}</p>
                    </div>
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
