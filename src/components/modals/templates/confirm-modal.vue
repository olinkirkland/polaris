<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton :closeButtonAction="onClickCancel">
                <h2>{{ props.title }}</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="confirm">
                <p v-html="props.message"></p>

                <div class="choices">
                    <Button @click="onClickCancel">
                        <span>{{ props.cancelText || 'Cancel' }}</span>
                    </Button>
                    <Button
                        :primary="props.isConfirmButtonPrimary"
                        :danger="props.isConfirmButtonDanger"
                        @click="props.onConfirm"
                    >
                        <span>{{ props.confirmText || 'Confirm' }}</span>
                    </Button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';

const props = defineProps<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirmButtonPrimary?: boolean;
    isConfirmButtonDanger?: boolean;
}>();

function onClickCancel() {
    props.onCancel ? props.onCancel() : ModalController.close();
}
</script>

<style scoped lang="scss">
.confirm {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

.choices {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .choices {
        flex-direction: column;
    }
}
</style>
