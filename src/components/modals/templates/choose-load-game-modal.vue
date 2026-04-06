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
                <!-- List of Save Games to be loaded -->
                <ul class="flex flex-col gap-2 overflow-y-auto w-1/3">
                    <li v-for="g in storage.manifestGroups">
                        <Button
                            :disabled="selectedManifestGroup?.id === g.id"
                            @click="selectedManifestGroup = g"
                            class="w-full"
                        >
                            <span>{{ g.manifests[0]?.summary.name }}</span>
                        </Button>
                    </li>
                </ul>

                <!-- Selected Save Game -->
                <Card class="w-2/3">
                    <p>{{ selectedManifestGroup?.manifests[0]?.summary.name }}</p>
                </Card>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { t } from '@/i18n/locale';
import { useStorageStore } from '@/store/storage-store';
import { ref } from 'vue';

const storage = useStorageStore();
const selectedManifestGroup = ref(storage.manifestGroups.length > 0 ? storage.manifestGroups[0] : null);
</script>

<style scoped lang="scss"></style>
