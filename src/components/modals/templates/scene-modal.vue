<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h2>{{ props.id }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="scene"></div>
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
