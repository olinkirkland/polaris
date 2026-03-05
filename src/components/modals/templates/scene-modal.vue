<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-panorama"></i>
                    <p>{{ props.id }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <pre>{{ props.id }}</pre>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';

const props = defineProps<{
    id: string;
}>();
</script>

<style scoped lang="scss"></style>
