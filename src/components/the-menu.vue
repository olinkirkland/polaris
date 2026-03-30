<template>
    <div class="the-menu flex items-center p-3 w-full justify-center">
        <div class="flex items-center mr-2">
            <div class="flex items-center gap-2">
                <Button @click="$emit('clickPanel', 'journal')">
                    <i class="fas fa-book"></i>
                    <span>Journal</span>
                </Button>
                <Button @click="$emit('clickPanel', 'party')">
                    <ExperienceBar />
                </Button>
                <Button @click="$emit('clickPanel', 'inventory')">
                    <i class="fas fa-box-open"></i>
                    <span>Inventory</span>
                </Button>
            </div>
        </div>
        <div class="flex gap-2">
            <Button @click="ModalController.open(PauseModal)">
                <span>Menu</span>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import ExperienceBar from './experience-bar.vue';
import PauseModal from './modals/templates/pause-modal.vue';
</script>

<style lang="scss" scoped>
.the-menu {
    position: absolute;
    top: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
}
</style>
