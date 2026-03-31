<template>
    <Card class="max-w-80">
        <div class="flex items-center">
            <div v-if="isLoadingContent">
                <i class="fas fa-circle-notch fa-spin"></i>
            </div>
            <div v-else class="flex flex-col gap-2 items-start">
                <!-- Packages -->
                <ul class="flex items-center gap-2 flex-wrap">
                    <li v-for="d in gameData.data?.packageDescriptions">
                        <Chip>
                            <i class="text-sm fas fa-cube"></i>
                            <span>{{ d.id }}</span>
                        </Chip>
                    </li>
                </ul>
                <Button @click="onClickManage">
                    <i class="fa-solid fa-tools"></i>
                    <span>{{ t('content_loader.manage_button') }}</span>
                </Button>
            </div>
        </div>
    </Card>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { PackageManifest } from '@/package-manifest';
import { useGameDataStore } from '@/store/game-data-store';
import { wait } from '@/util/wait-util';
import { ref } from 'vue';
import LoadContentModal from './modals/templates/load-content-modal.vue';
import Chip from './ui/chip.vue';
import { t } from '@/i18n/locale';

const gameData = useGameDataStore();
const availablePackages = ref<PackageManifest[]>([]);
const isLoadingContent = ref(false);

loadPackageManifests(); // Load by default

function onClickManage() {
    ModalController.open(LoadContentModal, {
        availablePackages: [...availablePackages.value],
        onConfirm: (selectedUrls: string[]) => {
            availablePackages.value.forEach((p) => (p.selected = selectedUrls.includes(p.url)));
            loadContent(selectedUrls);
        }
    });
}

async function loadPackageManifests() {
    const response = await fetch('assets/game-data/package-manifests.json');
    if (!response.ok) throw new Error(`@loadPackageManifests: ${response.status}`);
    const data: PackageManifest[] = await response.json();
    availablePackages.value = data;

    // Initial load if nothing is loaded yet
    if (!gameData.data?.packageDescriptions.length) {
        const previouslySelectedPackageUrlsStr = localStorage.getItem('selectedPackages');
        const urls = previouslySelectedPackageUrlsStr
            ? JSON.parse(previouslySelectedPackageUrlsStr)
            : availablePackages.value.filter((p) => p.forced).map((p) => p.url);

        // Map the available packages to set the selected property based on the previously selected URLs
        availablePackages.value.forEach((p) => {
            p.selected = urls.includes(p.url);
        });

        loadContent(urls);
    }
}

async function loadContent(urls: string[]) {
    isLoadingContent.value = true;
    gameData.resetGameData();
    await wait(0.25);
    await gameData.loadGameDataPackages(urls);
    localStorage.setItem('selectedPackages', JSON.stringify(urls));
    isLoadingContent.value = false;
}
</script>
