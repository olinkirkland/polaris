<template>
    <div class="track h-4 p-1 w-40 rounded-4xl">
        <div class="fill min-w-3 rounded-4xl h-full bg-white" :style="{ width: value * 100 + '%' }"></div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        required: true,
        type: Number
    }
});
</script>

<style lang="scss" scoped>
.track {
    background-color: var(--color-base);
}
</style>
