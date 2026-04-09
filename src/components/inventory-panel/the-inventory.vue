<template>
    <Panel class="p-3 h-full">
        <Card class="h-full">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Inventory</span>
                    <Button icon @click="$emit('on-close')">
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
            </template>
            <p>Available</p>
            <ul class="grid grid-cols-7 w-full">
                <li v-for="item of gameData.data?.items">
                    <Card pressed>
                        <p>
                            <strong>{{ item.quantity }}</strong>
                            {{ item.name }}
                        </p>
                        <!-- <img :src="item.icon" class="w-10" /> -->
                        <Button @click="onClickAddItem(item)">
                            <i class="fas fa-hand"></i>
                            <span>Give</span>
                        </Button>
                    </Card>
                </li>
            </ul>
            <p>Owned</p>
            <ul class="grid grid-cols-7 w-full">
                <li v-for="item of state.getInventory()">
                    <Card pressed>
                        <p>
                            <strong>{{ item.quantity }}</strong>
                            {{ item.name }}
                        </p>
                        <!-- <img :src="item.icon" class="w-10" /> -->
                    </Card>
                </li>
            </ul>
            <p>Recipes</p>
            <ul class="grid grid-cols-3 w-full">
                <li v-for="recipe of state.getRecipes()">
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
                        <Button @click="onClickCraft(recipe)" :disabled="!state.hasItems(recipe.inputs)">
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
import { Item } from '@/game-data/items/item';
import { Recipe } from '@/game-data/items/recipe';
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import Panel from '../ui/panel.vue';
const gameData = useGameDataStore();
const state = useGameStateStore();

function onClickAddItem(item: Item) {
    state.addItem(item);
}

function onClickCraft(recipe: Recipe) {
    state.craftRecipe(recipe);
}
</script>
