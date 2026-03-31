<template>
    <Panel class="h-full p-3">
        <Card class="h-full">
            <div class="flex gap-2">
                <Button v-for="character in party" :key="character.id" @click="selectedCharacter = character">
                    <span>{{ character.name }}</span>
                </Button>
            </div>
            <Card>
                <template #header>Stats</template>
                <div class="grid grid-cols-7 gap-2">
                    <Card
                        v-for="k in [
                            'health',
                            'mana',
                            'defense',
                            'criticalChance',
                            'criticalDamageMultiplier',
                            'guard',
                            'barrier'
                        ]"
                    >
                        <span class="capitalize text-center">
                            <h2>{{ selectedCharacter.stats.getValue(k) }}</h2>
                            {{ k }}
                        </span>

                        <ul class="flex flex-wrap gap-2">
                            <li v-for="(m, index) in selectedCharacter.stats.getStat(k).getModifiers()" :key="index">
                                <ModifierFlag :modifier="m" />
                            </li>
                        </ul>
                    </Card>
                </div>
            </Card>
            <Card>
                <template #header>Attributes ({{ selectedCharacter.attributePoints }} Points)</template>
                <div class="grid grid-cols-4 gap-2">
                    <Card v-for="k in ['brawn', 'agility', 'wits', 'aura']">
                        <span class="capitalize text-center">
                            <h2>{{ selectedCharacter.stats.getValue(k) }}</h2>
                            {{ k }}
                        </span>

                        <ul class="flex flex-wrap gap-2">
                            <li v-for="(m, index) in selectedCharacter.stats.getStat(k).getModifiers()" :key="index">
                                <ModifierFlag :modifier="m" />
                            </li>
                        </ul>
                    </Card>
                </div>
            </Card>
            <Card>
                <template #header>Skills ({{ selectedCharacter.skillPoints }} Points)</template>

                <div class="grid grid-cols-8 gap-2">
                    <Card
                        v-for="k in [
                            'prowess',
                            'endurance',
                            'skirmish',
                            'evasion',
                            'tinker',
                            'medicine',
                            'focus',
                            'conduit',
                            'reflex',
                            'insight'
                        ]"
                        :class="{ 'col-span-4': k === 'reflex' || k === 'insight' }"
                    >
                        <span class="capitalize text-center">
                            <h2>{{ selectedCharacter.stats.getValue(k) }}</h2>
                            {{ k }}
                        </span>

                        <ul class="flex flex-wrap gap-2">
                            <li v-for="(m, index) in selectedCharacter.stats.getStat(k).getModifiers()" :key="index">
                                <ModifierFlag :modifier="m" />
                            </li>
                        </ul>
                    </Card>
                </div>
            </Card>
            <Card></Card>
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
