<template>
    <div class="panel absolute top-0 left-0 h-full w-full">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.panel {
    background: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.8));
}
</style>
