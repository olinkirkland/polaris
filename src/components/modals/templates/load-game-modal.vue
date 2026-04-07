<template>
    <ModalFrame class="w-3xl">
        <template v-slot:header>
            <ModalHeader closeButton>
                <div class="flex w-full gap-2 items-center">
                    <p>{{ t('modals.load_game.heading') }}</p>
                </div>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div v-if="storage.manifestGroups.length > 0" class="max-h-2xl w-full flex gap-2">
                <!-- List of Save Games (Groups) to be loaded -->
                <ul class="flex flex-col gap-2 overflow-y-auto w-1/3">
                    <li v-for="g in storage.manifestGroups">
                        <Button
                            :disabled="selectedManifestGroup?.id === g.id"
                            @click="selectedManifestGroupId = g.id"
                            class="w-full"
                        >
                            <span>{{ g.manifests[0]?.summary.name }}</span>
                        </Button>
                    </li>
                </ul>

                <!-- Selected Save Game -->
                <Card class="w-2/3" v-if="selectedManifestGroup">
                    <div>
                        <p>{{ selectedManifestGroup.manifests[0]?.summary.name }}</p>
                        <small>{{ selectedManifestGroup.manifests[0]?.summary.path }}</small>
                    </div>

                    <ul class="flex flex-col gap-2 w-full overflow-y-auto">
                        <li v-for="m in selectedManifestGroup.manifests">
                            <Card class="border-style">
                                <div class="flex gap-2 w-full">
                                    <div class="flex flex-col">
                                        <span>{{ m.label }}</span>
                                        <!-- <small>Level 99, Lorem Ipsu</small> -->
                                        <small>{{ new Date(m.date).toLocaleString() }}</small>
                                    </div>
                                    <div class="flex gap-2 ml-auto">
                                        <Button @click="storage.remove(m.path)">
                                            <span>{{ t('modals.load_game.delete_button') }}</span>
                                        </Button>
                                        <Button @click="onClickLoad(m.path)">
                                            <span>{{ t('modals.load_game.load_button') }}</span>
                                        </Button>
                                    </div>
                                </div>
                                <!-- TODO: Highlight the chips of packageIds that are missing -->
                                <template #footer v-if="false">
                                    <div class="flex flex-col gap-2">
                                        <ul class="flex flex-wrap gap-2">
                                            <li v-for="p in m.packageIds">
                                                <Chip>
                                                    <i class="text-sm fas fa-cube"></i>
                                                    <span>{{ p }}</span>
                                                </Chip>
                                            </li>
                                        </ul>
                                        <small>
                                            Caution! Not all content expected by this save is loaded. You can load
                                            anyway, but there may be unintended consequences.
                                        </small>
                                        <!-- {{ t('modals.load_game.package_mismatch_warning') }} -->
                                    </div>
                                </template>
                            </Card>
                        </li>
                    </ul>

                    <Card class="border-style">
                        <span>{{ t('modals.load_game.permanently_delete_character_label') }}</span>
                        <Button @click="selectedManifestGroup?.manifests.forEach((m) => storage.remove(m.path))">
                            <span>{{ t('modals.load_game.permanently_delete_character_button') }}</span>
                        </Button>
                    </Card>
                </Card>
            </div>
            <div v-else>
                <em>{{ t('modals.load_game.no_results') }}</em>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import Chip from '@/components/ui/chip.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import { useGameStateStore } from '@/store/game-state-store';
import { useStorageStore } from '@/store/storage-store';
import { computed, ref } from 'vue';

const storage = useStorageStore();
const gameState = useGameStateStore();

const props = defineProps<{
    selectedManifestGroupId?: string;
}>();

const selectedManifestGroupId = ref(props.selectedManifestGroupId || null);

const selectedManifestGroup = computed(() => {
    if (!selectedManifestGroupId.value) return null;
    return storage.manifestGroups.find((m) => m.id === selectedManifestGroupId.value);
});

function onClickLoad(path: string) {
    gameState.load(path);
    ModalController.close();
}
</script>
