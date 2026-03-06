<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fas fa-panorama"></i>
                    <p>{{ props.id }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <Button @click="onClickComplete()"><span>Complete</span></Button>
        </template>
        <template #footer>
            <small>{{ props.id }}</small>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';

const props = defineProps<{
    id: string;
}>();

function onClickComplete() {
    console.log('Completing scene', props.id);
    ModalController.close();
}
</script>

<style scoped lang="scss"></style>
