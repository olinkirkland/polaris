<template>
    <label class="checkbox-wrapper">
        <input type="checkbox" v-model="model" :value="value" />
        <i :class="{ 'fa-regular fa-square': !model, 'fa-solid fa-square-check': model }"></i>
        <span class="checkbox-label"><slot></slot></span>
    </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: [Array, Boolean],
        default: false
    },
    value: {
        type: [Boolean, Object, String, Number],
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});
</script>

<style scoped lang="scss">
.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    cursor: pointer;

    > input[type='checkbox'] {
        display: none;
    }

    > i {
        color: var(--color-theme);
        font-size: 1.5rem;
    }

    > input:checked ~ i {
        color: var(--color-theme);
    }
}
</style>
