<template>
    <div class="panel flex gap-2 p-2 pr-4 rounded-full">
        <img :src="item.icon" class="w-6 h-6" />
        <p class="whitespace-nowrap">{{ item.name }}</p>
        <!-- <PriceBadge :value="item.price" /> -->
    </div>
    <!-- <small>{{ item.description }}</small> -->
</template>

<script lang="ts" setup>
import { useGameDataStore } from '@/store/game-data-store';
import { computed } from 'vue';
const gameData = useGameDataStore();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const item = computed(() => gameData.getItem(props.id));
</script>

<style lang="scss" scoped>
.panel {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>
