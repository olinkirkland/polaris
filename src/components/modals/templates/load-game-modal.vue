<template>
    <ModalFrame class="w-96">
        <template v-slot:header>
            <ModalHeader closeButton>
                <div class="flex w-full gap-2 items-center">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>{{ name }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <ul class="flex flex-col gap-2">
                <li v-for="m in manifestGroup.manifests">
                    <div class="flex justify-between">
                        <div class="flex flex-col">
                            <span>{{ m.label }}</span>
                            <small>{{ new Date(m.date).toLocaleString() }}</small>
                        </div>
                        <Button @click="onClickLoad(m.path)">Load</Button>
                    </div>
                </li>
            </ul>
        </template>
        <template #footer>
            <small class="w-full text-center">{{ props.manifestGroup.id }}</small>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifestGroup } from '@/store/storage-store';
import { computed } from 'vue';

const state = useGameStateStore();

const props = defineProps<{
    manifestGroup: StoredGameManifestGroup;
}>();

const name = computed(() => {
    const m = props.manifestGroup.manifests[0];
    return m.summary.name || 'Unnamed';
});

function onClickLoad(path: string) {
    state.load(path);
    ModalController.close();
}
</script>
