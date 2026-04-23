<template>
    <Card class="border-style">
        <template #header>
            <p>{{ recipe.name }}</p>
        </template>
        <div class="grid grid-cols-2 w-full gap-2">
            <Card>
                <template #header>
                    <p>Inputs</p>
                </template>
                <ul class="flex flex-col gap-2">
                    <li v-for="t in recipe.inputs" class="flex items-center gap-2">
                        {{ t.quantity }} <ItemBlock :id="t.id" />
                    </li>
                </ul>
            </Card>
            <Card>
                <template #header>
                    <p>Outputs</p>
                </template>
                <ul class="flex flex-col gap-2">
                    <li v-for="t in recipe.outputs" class="flex items-center gap-2">
                        {{ t.quantity }} <ItemBlock :id="t.id" />
                    </li>
                </ul>
            </Card>
        </div>
        <Button @click="onClickCraft()" :disabled="!gameState.canCraftRecipe(recipe)">
            <span>Craft</span>
        </Button>
    </Card>
</template>

<script lang="ts" setup>
import { useGameDataStore } from '@/store/game-data-store';
import { useGameStateStore } from '@/store/game-state-store';
import { computed } from 'vue';
import ItemBlock from './item-block.vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const recipe = computed(() => {
    return gameData.getRecipe(props.id);
});

const gameData = useGameDataStore();
const gameState = useGameStateStore();

function onClickCraft() {
    gameState.craftRecipe(recipe.value);
}
</script>
