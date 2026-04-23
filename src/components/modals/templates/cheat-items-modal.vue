<template>
    <ModalFrame class="w-175">
        <template v-slot:header>
            <ModalHeader close-button>
                <div class="flex w-full gap-2 items-center">
                    <p>{{ t('modals.cheat_items.heading') }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <p>{{ t('modals.cheat_items.description') }}</p>
            <ul class="grid grid-cols-3 w-full gap-2">
                <li v-for="item of gameData.data?.items" class="h-full cursor-pointer">
                    <Card pressed @click="gameState.addItem(item)">
                        <div class="flex gap-2">
                            <img :src="item.icon" class="w-6 h-6" />
                            <p>
                                +{{ item.quantity }} ({{ gameState.getItem(item.id)?.quantity || 0 }})
                                {{ item.name }}
                            </p>
                        </div>
                    </Card>
                </li>
            </ul>
            <p>{{ t('modals.cheat_recipes.description') }}</p>
            <ul class="grid grid-cols-3 w-full gap-2">
                <li v-for="recipe of gameData.data?.recipes" class="h-full cursor-pointer">
                    <Card pressed @click="gameState.addRecipe(recipe.id)">
                        <div class="flex gap-2">
                            <div class="relative">
                                <img :src="gameData.getItem(recipe.outputs[0].id).icon" class="w-6 h-6 opacity-50" />
                                <img
                                    src="/assets/images/icons/recipe.png"
                                    class="absolute -top-1.5 -right-1.5 w-4 h-4"
                                />
                            </div>
                            <p>{{ recipe.name }}</p>
                        </div>
                    </Card>
                </li>
            </ul>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { t } from '@/i18n/locale';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
</script>
