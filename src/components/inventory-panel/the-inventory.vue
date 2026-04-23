<template>
    <Panel class="p-3 h-full">
        <Card class="h-full overflow-hidden">
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
            <div class="w-full flex gap-2">
                <div class="flex flex-col gap-2">
                    <h2>Owned</h2>
                    <ul class="flex flex-col gap-1">
                        <li v-for="item of gameState.getInventory()" class="flex items-center gap-2">
                            ({{ item.quantity }}) <ItemBlock :id="item.id" />
                        </li>
                    </ul>
                </div>
                <div class="flex flex-col gap-2">
                    <h2>Recipes</h2>
                    <ul class="grid grid-cols-3 w-full gap-1">
                        <li v-for="recipe of gameState.getRecipes()">
                            <RecipeBlock :id="recipe.id" />
                        </li>
                    </ul>
                </div>
            </div>
        </Card>
    </Panel>
</template>

<script lang="ts" setup>
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import CheatItemsModal from '../modals/templates/cheat-items-modal.vue';
import Panel from '../ui/panel.vue';
import ItemBlock from './item-block.vue';
import RecipeBlock from './recipe-block.vue';
const gameState = useGameStateStore();
</script>
