<template>
    <Button @click="action.act()">
        <template v-if="props.action.type === ActionType.GO_TO_ATLAS">
            <i class="fas fa-globe"></i>
            <span>Go to Atlas</span>
            <mark>{{ (props.action as GoToAtlasAction).point }}</mark>
        </template>
        <template v-else-if="props.action.type === ActionType.GO_TO_ZONE">
            <i class="fas fa-map-pin"></i>
            <span>Go to Zone</span>
            <mark>{{ (props.action as GoToZoneAction).id }}</mark>
        </template>
        <template v-else-if="props.action.type === ActionType.START_SCENE">
            <i class="fas fa-panorama"></i>
            <span>Start Scene</span>
            <mark>{{ (props.action as StartSceneAction).id }}</mark>
        </template>
        <template v-else-if="props.action.type === ActionType.PATCH_STATE">
            <i class="fas fa-pencil"></i>
            <mark>{{ (props.action as PatchStateAction).path }}: {{ (props.action as PatchStateAction).value }}</mark>
        </template>
        <template v-else>
            <i class="fas fa-play"></i>
            <span>[{{ props.action.type }}]</span>
        </template>
    </Button>
</template>

<script lang="ts" setup>
import { ActionType, BaseAction } from '@/actions/base-action';
import { GoToAtlasAction } from '@/actions/go-to-atlas-action';
import { GoToZoneAction } from '@/actions/go-to-zone-action';
import { PatchStateAction } from '@/actions/patch-state-action';
import { StartSceneAction } from '@/actions/start-scene-action';
import { PropType } from 'vue';

const props = defineProps({
    action: {
        type: Object as PropType<BaseAction>,
        required: true
    }
});
</script>
