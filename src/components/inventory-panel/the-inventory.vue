<template>
    <Panel class="p-3 h-full">
        <Card class="h-full">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <div class="flex gap-2">
                        <span>Inventory</span>
                        <Button icon @click="ModalController.open(CheatItemsModal)">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </Button>
                    </div>
                    <Button icon @click="$emit('on-close')">
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
            </template>
            <p>Owned</p>
            <ul class="grid grid-cols-5 w-full">
                <li v-for="item of gameState.getInventory()">
                    <Card pressed>
                        <div class="flex gap-2">
                            <img :src="item.icon" class="w-6 h-6" />
                            <p>
                                <strong>{{ item.quantity }}</strong>
                                {{ item.name }}
                            </p>
                        </div>
                        <small>${{ item.price }} ea.</small>
                        <small>{{ item.description }}</small>
                    </Card>
                </li>
            </ul>
            <p>Recipes</p>
            <ul class="grid grid-cols-3 w-full">
                <li v-for="recipe of gameState.getRecipes()">
                    <Card class="border-style">
                        <template #header>
                            <p>{{ recipe.name }}</p>
                        </template>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p>Inputs</p>
                                <ul>
                                    <li v-for="t in recipe.inputs">{{ t.quantity }}x {{ t.id }}</li>
                                </ul>
                            </div>

                            <div>
                                <p>Outputs</p>
                                <ul>
                                    <li v-for="t in recipe.outputs">{{ t.quantity }}x {{ t.id }}</li>
                                </ul>
                            </div>
                        </div>
                        <Button @click="onClickCraft(recipe)" :disabled="!gameState.hasItems(recipe.inputs)">
                            <i class="fas fa-play"></i>
                            <span>Craft</span>
                        </Button>
                    </Card>
                </li>
            </ul>
        </Card>
    </Panel>
</template>

<script lang="ts" setup>
import ModalController from '@/controllers/modal-controller';
import { Recipe } from '@/game-data/items/recipe';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import CheatItemsModal from '../modals/templates/cheat-items-modal.vue';
import Panel from '../ui/panel.vue';
const gameData = useGameDataStore();
const gameState = useGameStateStore();

function onClickCraft(recipe: Recipe) {
    gameState.craftRecipe(recipe);
}
</script>
