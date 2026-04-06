<template>
    <Card class="max-w-72">
        <template #header>
            <div class="w-full flex flex-col justify-center items-center">
                <p>{{ recentSave.summary.name }}</p>
            </div>
        </template>

        <div class="w-full flex flex-col gap-2">
            <div class="flex gap-2 justify-center">
                <Button
                    @click="onClickLoad()"
                    v-tippy="{
                        content: t('stored_game.view_game_button_tooltip', {
                            count: manifestGroup.manifests.length
                        })
                    }"
                >
                    <i class="fas fa-archive"></i>
                    <span>{{ t('stored_game.view_game_button') }}</span>
                </Button>
                <Button
                    @click="onClickContinue()"
                    :disabled="!arePackagesLoaded()"
                    v-tippy="{ content: recentSaveTooltip }"
                >
                    <span>{{ t('stored_game.continue_game_button') }}</span>
                </Button>
            </div>
        </div>

        <template #footer>
            <div class="flex flex-col w-full gap-2">
                <ul class="flex flex-wrap justify-center gap-2">
                    <li v-for="p in manifestGroup.manifests[0].packageIds">
                        <Chip>
                            <i class="text-sm fas fa-cube"></i>
                            <span>{{ p }}</span>
                        </Chip>
                    </li>
                </ul>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { useGameStateStore } from '@/store/game-state-store';
import { StoredGameManifestGroup } from '@/store/storage-store';
import { computed, PropType } from 'vue';
import LoadGameModal from './modals/templates/load-game-modal.vue';
import Chip from './ui/chip.vue';
import { useGameDataStore } from '@/store/game-data-store';
import { t } from '@/i18n/locale';

const gameState = useGameStateStore();
const gameData = useGameDataStore();

const props = defineProps({
    manifestGroup: {
        type: Object as PropType<StoredGameManifestGroup>,
        required: true
    }
});

const recentSave = computed(() => props.manifestGroup.manifests[0]);
const recentSaveTooltip = computed(() => {
    if (!recentSave.value) return 'No recent save found';
    return `
    <div class="w-full flex flex-col justify-center items-center">
        <p>${recentSave.value.summary.name}</p>
    </div>
    <div class="w-full flex flex-col gap-2">
        <small class="text-center">
            ${recentSave.value.label}
            &nbsp;•&nbsp;
            ${new Date(recentSave.value.date).toLocaleString()}
        </small>
    </div>`;
});

function onClickLoad() {
    ModalController.open(LoadGameModal, { manifestGroup: props.manifestGroup });
}

function onClickContinue() {
    const manifest = props.manifestGroup.manifests[0];
    gameState.load(manifest.path);
}

function arePackagesLoaded() {
    const gamePackageIds = props.manifestGroup.manifests[0].packageIds;
    const loadedPackageIds = gameData.data?.packageDescriptions.map((p) => p.id);
    return gamePackageIds.every((p) => loadedPackageIds?.includes(p));
}
</script>
