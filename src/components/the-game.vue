<template>
    <div class="layout">
        <TheMenu />
        <Atlas />
        <Zone />
    </div>
</template>

<script setup lang="ts">
import Atlas from './atlas/atlas.vue';
import TheMenu from './the-menu.vue';
import Zone from './zone/zone.vue';
</script>

<style lang="scss" scoped>
.layout {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}
</style>
