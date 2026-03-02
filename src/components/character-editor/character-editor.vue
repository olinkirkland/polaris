<template>
    <Card>
        <template #header>Character Editor</template>
        <label class="input-box">
            <span>Name</span>
            <input type="text" placeholder="Character Name" />
        </label>
    </Card>
</template>

<script setup lang="ts">
import Card from '../shared/card.vue';
</script>

<style lang="scss" scoped></style>
