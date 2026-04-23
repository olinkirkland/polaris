<template>
    <div class="flex gap-1">
        <img src="/assets/images/icons/gold.png" class="size-4" />
        <small>{{ value }}</small>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Number,
        required: true
    }
});
</script>

<style lang="scss" scoped>
small {
    color: #ffe690;
}
</style>
