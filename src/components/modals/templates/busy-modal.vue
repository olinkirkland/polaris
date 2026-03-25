<template>
    <ModalFrame>
        <template v-slot:content>
            <div class="flex flex-col p-5 gap-2 content-center items-center">
                <i class="fa-regular fa-compass fa-spin text-3xl"></i>
                <p>{{ message }}</p>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '../modal-frame.vue';

const props = defineProps<{
    message: string;
}>();
</script>

<style scoped lang="scss"></style>
