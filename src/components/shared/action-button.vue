<template>
    <Button @click="action.act()">
        <template v-if="props.action.type === ActionType.GO_TO_ATLAS">
            <i class="fa-solid fa-globe"></i>
            <span>Go to Atlas</span>
            <mark>{{ (props.action as GoToAtlasAction).point }}</mark>
        </template>
        <template v-if="props.action.type === ActionType.GO_TO_ZONE">
            <i class="fa-solid fa-map-pin"></i>
            <span>Go to Zone</span>
            <mark>{{ (props.action as GoToZoneAction).id }}</mark>
        </template>
        <template v-if="props.action.type === ActionType.START_SCENE">
            <i class="fa-solid fa-panorama"></i>
            <span>Start Scene</span>
            <mark>{{ (props.action as StartSceneAction).id }}</mark>
        </template>
    </Button>
</template>

<script lang="ts" setup>
import { ActionType, BaseAction } from '@/actions/base-action';
import { GoToAtlasAction } from '@/actions/go-to-atlas';
import { GoToZoneAction } from '@/actions/go-to-zone';
import { StartSceneAction } from '@/actions/start-scene';
import { PropType } from 'vue';

const props = defineProps({
    action: {
        type: Object as PropType<BaseAction>,
        required: true
    }
});
</script>
