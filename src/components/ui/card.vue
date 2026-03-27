<template>
    <div class="card flex flex-col" :class="{ pressed: props.pressed }">
        <div class="background"></div>
        <header v-if="hasHeader" class="p-3 w-full flex items-center gap-2">
            <slot name="header"></slot>
        </header>
        <div class="flex flex-col p-3 gap-2 flex-1" v-if="$slots.default">
            <slot></slot>
        </div>
        <slot name="floor"></slot>
        <footer v-if="hasFooter" class="p-3 w-full flex items-center gap-2">
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

const props = defineProps<{
    pressed?: boolean;
}>();

const slots = useSlots();
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    &.pressed {
        .background {
            border-image: url('assets/images/ui-textures/default/transparent-center/panel-transparent-center-005.png')
                15 fill stretch;
        }
    }

    header {
        border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    }

    footer {
        border-top: 1px solid rgba($color: #ffffff, $alpha: 0.2);
    }

    header,
    footer {
        min-height: 2rem;
        flex-shrink: 0;
    }
}

.background {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    border: 7px solid transparent;
    border-image: url('assets/images/ui-textures/default/panel/panel-005.png') 15 fill stretch;
    filter: invert(1);
    opacity: 0.8;
}
</style>
