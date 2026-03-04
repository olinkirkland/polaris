<template>
    <ModalFrame class="w-96">
        <template v-slot:header>
            <ModalHeader>
                <div class="flex w-full gap-2 items-center">
                    <i class="fa-solid fa-user"></i>
                    <p>Who are you?</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <label class="input-box">
                <span>My Name</span>
                <input type="text" placeholder="Character Name" />
            </label>
        </template>
        <template #footer>
            <button>Ok</button>
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
