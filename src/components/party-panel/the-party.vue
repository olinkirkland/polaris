<template>
    <Panel class="h-full p-3">
        <Card class="h-full">
            <div class="flex gap-2">
                <Button v-for="character in party" :key="character.id" @click="selectedCharacter = character">
                    <span>{{ character.name }}</span>
                </Button>
            </div>
            <Card>
                <template #header>Attributes</template>
                <div class="grid grid-cols-4 gap-2">
                    <Card v-for="k in ['brawn', 'agility', 'wits', 'aura']">
                        <h2 class="capitalize text-center">
                            <span>{{ selectedCharacter.stats.getValue(k) }}</span> {{ k }}
                        </h2>
                        <ul class="flex flex-wrap gap-2">
                            <li v-for="(m, index) in selectedCharacter.stats.getStat(k).getModifiers()" :key="index">
                                <ModifierFlag :modifier="m" />
                            </li>
                        </ul>
                    </Card>
                </div>
            </Card>
            <Card>
                <template #header>Skills</template>

                <div class="grid grid-cols-5 gap-2">
                    <Card
                        v-for="k in [
                            'prowess',
                            'endurance',
                            'skirmish',
                            'evasion',
                            'reflex',
                            'tinker',
                            'medicine',
                            'focus',
                            'conduit',
                            'insight'
                        ]"
                    >
                        <h3 class="capitalize text-center">
                            <span>{{ selectedCharacter.stats.getValue(k) }}</span> {{ k }}
                        </h3>
                        <ul class="flex flex-wrap gap-2">
                            <li v-for="(m, index) in selectedCharacter.stats.getStat(k).getModifiers()" :key="index">
                                <ModifierFlag :modifier="m" />
                            </li>
                        </ul>
                    </Card>
                </div>
            </Card>
        </Card>
    </Panel>
</template>

<script lang="ts" setup>
import { Character } from '@/game-data/character/character';
import { useGameStateStore } from '@/store/game-state-store';
import { ref } from 'vue';
import Button from '../ui/button.vue';
import Card from '../ui/card.vue';
import ModifierFlag from '../ui/modifier-flag.vue';
import Panel from '../ui/panel.vue';

const gameState = useGameStateStore();

const party = gameState.getValue('party') as Character[];
const selectedCharacter = ref<Character>(party[0]);
</script>
