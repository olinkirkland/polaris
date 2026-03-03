<template>
    <Card>
        <template #header>
            <div class="w-full flex flex-col justify-center items-center">
                <strong>{{ name }}</strong>
            </div>
        </template>

        <div class="w-full flex flex-col gap-2">
            <small class="text-center">
                {{ manifestGroup.manifests[0].label }}
                &nbsp;❖&nbsp;
                {{ date.toLocaleString() }}
            </small>
            <div class="flex gap-2 justify-center">
                <Button @click="onClickLoad()">Load ({{ manifestGroup.manifests.length }})</Button>
                <Button @click="onClickContinue()">Continue</Button>
            </div>
        </div>

        <template #footer>
            <small class="w-full text-center">{{ manifestGroup.id }}</small>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifestGroup } from '@/store/storage-store';
import { computed, PropType } from 'vue';
import LoadGameModal from './modals/templates/load-game-modal.vue';

const gameState = useGameStateStore();

const props = defineProps({
    manifestGroup: {
        required: true,
        type: Object as PropType<StoredGameManifestGroup>
    }
});

const date = computed(() => new Date(props.manifestGroup.manifests[0].date));
const name = computed(() => props.manifestGroup.manifests[0].summary.name || 'Unnamed');

function onClickLoad() {
    ModalController.open(LoadGameModal, { manifestGroup: props.manifestGroup });
}

function onClickContinue() {
    const manifest = props.manifestGroup.manifests[0];
    gameState.load(manifest.path);
}
</script>
