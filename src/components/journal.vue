<template>
    <Card>
        <Card>
            <ul class="flex flex-wrap gap-2">
                <li v-for="(flagValue, flagName) in gameState.getValue('flags')">
                    <Flag :flag-name="flagName.toString()" :flag-value="flagValue" />
                </li>
            </ul>
        </Card>
        <pre>{{ gameState.getValue('quests') }}</pre>
        <ul class="flex flex-col">
            <li v-for="q in gameData?.data?.quests">
                <Card>
                    <pre>{{ q.label }}</pre>
                    <pre>{{ q.condition }}</pre>
                    <ul class="grid grid-cols-6 gap-2">
                        <li v-for="n in q.nodes">
                            <Card>
                                {{ n.id }}
                            </Card>
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
