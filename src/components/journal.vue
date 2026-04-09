<template>
    <Panel class="p-3">
        <Card class="h-full">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Journal</span>
                    <Button icon @click="$emit('on-close')">
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
            </template>
            <Card>
                <ul class="flex flex-wrap gap-2">
                    <li v-for="(flagValue, flagName) in gameState.getValue('flags')">
                        <Flag :flagLabel="flagName.toString()" :flag-value="flagValue" />
                    </li>
                </ul>
            </Card>
            <ul class="flex flex-col gap-2">
                <li v-for="q in gameData?.data?.quests">
                    <Card v-if="gameState.getActiveQuestNodeId(q.id)">
                        <template #header>
                            <div class="flex flex-col">
                                <h2 class="w-fit mb-1">{{ q.label }}</h2>
                                <p v-html="q.getActiveNode()?.description"></p>
                            </div>
                        </template>
                        <ul class="flex flex-col ml-2">
                            <li v-for="n in q.nodes">
                                <span v-if="n.label.length > 0" class="flex gap-1">
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
                    </Card>
                </li>
            </ul>
        </Card>
    </Panel>
</template>

<script lang="ts" setup>
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import Card from './ui/card.vue';
import Flag from './ui/flag.vue';
import Panel from './ui/panel.vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
</script>
