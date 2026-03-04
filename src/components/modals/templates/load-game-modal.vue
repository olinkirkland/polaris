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
                    <div class="flex gap-2">
                        <div class="flex flex-col">
                            <span>{{ m.label }}</span>
                            <!-- <small>Level 99, Lorem Ipsum</small> -->
                            <small>{{ new Date(m.date).toLocaleString() }}</small>
                        </div>
                        <Button class="ml-auto" @click="onClickLoad(m.path)">Load</Button>
                    </div>
                </li>
            </ul>
            <Card pressed>
                <div class="flex flex-col gap-1">
                    <span>Permanently delete this character?</span>
                    <Button @click="onClickRemove()">
                        <i class="fa-solid fa-trash"></i>
                        <span>Delete this Character</span>
                    </Button>
                </div>
            </Card>
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
import { StoredGameManifestGroup, useStorageStore } from '@/store/storage-store';
import { computed } from 'vue';

const state = useGameStateStore();
const storage = useStorageStore();

const props = defineProps<{
    manifestGroup: StoredGameManifestGroup;
}>();

const name = computed(() => {
    const m = props.manifestGroup.manifests[0];
    return m.summary.name || 'Unnamed';
});

function onClickRemove() {
    props.manifestGroup.manifests.forEach((m) => storage.remove(m.path));
    ModalController.close();
}

function onClickLoad(path: string) {
    state.load(path);
    ModalController.close();
}
</script>
