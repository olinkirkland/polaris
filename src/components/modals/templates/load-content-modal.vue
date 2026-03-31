<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <div class="flex w-full gap-2 items-center">
                    <i class="fa-solid fa-tools"></i>
                    <p>Manage Content</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2 max-h-50 overflow-y-auto pr-1">
                    <label v-for="c in availablePackages" class="cursor-pointer">
                        <Card :pressed="c.selected">
                            <div class="flex gap-2 items-center">
                                <Checkbox :id="c.url" v-model="c.selected" :locked="c.forced" />
                                <div class="flex flex-col">
                                    <small
                                        >{{ c.label }} <span class="muted">{{ c.url }}</span></small
                                    >
                                </div>
                            </div>
                        </Card>
                    </label>
                </div>
            </div>
        </template>
        <template #footer>
            <Button @click="onClickConfirm" class="ml-auto">
                <span>Load Selected Content</span>
            </Button>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { PackageManifest } from '@/package-manifest';
import { useGameDataStore } from '@/store/game-data-store';

const props = defineProps<{
    availablePackages: PackageManifest[];
    onConfirm: (selectedUrls: string[]) => void;
}>();

function onClickConfirm() {
    const selectedContent = props.availablePackages.filter((c) => c.selected).map((p) => p.url);
    props.onConfirm(selectedContent);
    ModalController.close();
}
</script>

<style scoped lang="scss"></style>
