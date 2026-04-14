<template>
    <div v-if="visible" class="overlay fixed top-0 left-0 z-99 flex justify-end items-end w-full h-full">
        <span class="p-5">{{ message }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SaveOverlayController from '@/controllers/save-overlay-controller';

const visible = ref(false);
const message = ref();

SaveOverlayController.getInstance().addEventListener(({ visible: v, message: m }) => {
    visible.value = v;
    message.value = m;
});
</script>

<style scoped>
.overlay {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
}
</style>
