<template>
    <button
        class="btn"
        :class="{
            'btn--mini': mini,
            'btn--icon': icon,
            'btn--disabled': disabled,
            'btn--theme': theme,
            'btn--square': square,
            pressed: pressed || disabled,
            'full-width': fullWidth
        }"
        :disabled="disabled"
    >
        <div class="btn__shadow"></div>
        <div class="btn__content"><slot></slot></div>
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    mini: Boolean,
    icon: Boolean,
    theme: Boolean,
    danger: Boolean,
    disabled: Boolean,
    fullWidth: Boolean,
    pressed: Boolean,
    square: Boolean
});
</script>

<style lang="scss" scoped>
button {
    position: relative;
    background-color: transparent;
    flex-shrink: 0;
    font-size: 1rem;
    font-family: var(--body);
}

.full-width > .btn__content {
    justify-content: center;
}

.btn__content {
    position: relative;
    top: -0.2rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    height: 2rem;
    padding: 0 0.5rem;
    border-radius: var(--border-radius);
    background-color: var(--color-surface);
    border: 1px solid var(--color-base-weak);
    cursor: pointer;
    transition: all 0.1s ease-in-out;
}

button.pressed > .btn__content,
.btn__content:active,
.btn__content:focus {
    transition: unset;
    filter: brightness(0.95);
    top: 0;
}

.btn__shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    background-color: var(--color-base-weak);
}

// Primary button
.btn--theme {
    .btn__content {
        background-color: var(--color-theme);
        border: 1px solid var(--color-theme-strong);
        * {
            color: var(--color-text-reverse);
        }
    }
    .btn__shadow {
        background-color: var(--color-theme-strong);
    }
}

.btn--square {
    width: 3.65rem; // Same as when just an icon is in it
    > .btn__content {
        padding: 0;
        justify-content: center;
    }
}

// Icon-only button
.btn.btn--icon {
    .btn__content {
        width: 2rem;
        height: 2rem;
        background-color: transparent;
        border: none;
        top: 0;
        justify-content: center;
        align-items: center;
    }
    .btn__shadow {
        background-color: transparent;
    }
}

// Mini button
.btn.btn--mini {
    .btn__content {
        padding: 0.2rem;
        width: unset;
        height: unset;
    }
}

// Disabled
.btn--disabled {
    pointer-events: none;
    opacity: 0.4;

    .btn__shadow {
        background-color: transparent;
    }
}

@media (max-width: 768px) {
    .full-width-mobile {
        width: 100%;
        .btn__content {
            justify-content: center;
        }
    }
}
</style>
