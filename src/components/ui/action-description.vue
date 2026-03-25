<template>
    <div class="inline-flex gap-1 items-center">
        <template v-if="props.action.type === ActionType.GO_TO_ATLAS">
            <i class="fas fa-level-up-alt"></i>
            <mark>
                <span>{{ (props.action as GoToAtlasAction).point.x }},</span>
                <span>{{ (props.action as GoToAtlasAction).point.y }}</span>
            </mark>
        </template>
        <template v-else-if="props.action.type === ActionType.GO_TO_ZONE">
            <i class="fas fa-level-down-alt"></i>
            <mark>{{ (props.action as GoToZoneAction).id }}</mark>
        </template>
        <template v-else-if="props.action.type === ActionType.SCENE">
            <i class="fas fa-panorama"></i>
            <mark>{{ (props.action as StartSceneAction).id }}</mark>
        </template>
        <template v-else-if="props.action.type === ActionType.PATCH_STATE">
            <i class="fas fa-pencil"></i>
            <mark>{{ (props.action as PatchStateAction).path }}: {{ (props.action as PatchStateAction).value }}</mark>
        </template>
        <template v-else>
            <span>[{{ props.action.type }}]</span>
        </template>
    </div>
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
