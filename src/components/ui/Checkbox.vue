<template>
    <label :for="id" class="checkbox flex gap-1 w-fit cursor-pointer rounded-sm has-focus">
        <input
            type="checkbox"
            class="absolute opacity-0 h-0 w-0"
            :id="id"
            :checked="modelValue"
            @change="handleChange"
        />
        <div class="box w-5 h-5 rounded-sm flex justify-center items-center leading-0" :class="{ checked: modelValue }">
            <i v-if="modelValue" class="text-xs fa-solid fa-check"></i>
        </div>
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (event: any) => {
    emit('update:modelValue', event.target.checked);
};
</script>

<style scoped lang="scss">
.box {
    border: 1px solid var(--color-base-faint);
    background-color: var(--color-surface-raised);
    transition: 0.2s box-shadow;
    &:hover {
        box-shadow: var(--shadow-sm);
    }

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
    }

    &.checked {
        border: 1px solid var(--color-theme);
        background-color: var(--color-theme);
        color: var(--color-ink-reverse);
    }
}

:global([disabled] .checkbox .box.checked) {
    background-color: var(--color-base-weaker);
    border: 1px solid var(--color-base-weaker);
}
</style>
