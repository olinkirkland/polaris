<template>
    <div
        class="panel absolute top-0 h-full"
        :class="{ 'right-0': layout === 'right', 'w-full': layout === 'full', 'w-2/5': layout !== 'full' }"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    layout: 'left' | 'right' | 'full';
}>();
</script>
