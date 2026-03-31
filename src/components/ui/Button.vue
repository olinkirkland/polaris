<template>
    <button class="relative flex cursor-pointer" :class="{ icon, pressed }">
        <div class="content flex items-center justify-center w-full gap-1.5">
            <slot></slot>
        </div>
        <div class="background"></div>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    icon?: boolean;
    pressed?: boolean;
}>();
</script>

<style scoped lang="scss">
button {
    height: fit-content;
    color: white;

    .content {
        padding: 0.25rem 0.75rem;
    }

    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 7px solid transparent;
        border-image: url('assets/images/ui-textures/default/border/panel-border-013.png') 10 fill stretch;
    }

    &.icon {
        background-color: transparent;
        border: none;

        .content {
            padding: 0.25rem !important;
        }

        :deep(i) {
            margin: 0;
        }

        .background {
            display: none;
        }

        &:hover {
            box-shadow: none;
        }
    }

    &:hover {
        :deep(span) {
            text-underline-offset: 0.2rem;
            text-decoration: underline;
        }
    }

    &.pressed,
    &.pressed:hover {
        filter: brightness(0.97);
        box-shadow: none;
    }

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
    }
}

:deep(span) {
    white-space: nowrap;
}

:deep(i) {
    font-size: smaller;
}

:deep(i:first-child),
:deep(span:first-child) {
    margin-left: 0.25rem;
}

:deep(:last-child:not(mark)) {
    margin-right: 0.25rem;
}
</style>
