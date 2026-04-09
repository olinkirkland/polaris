<template>
    <Panel class="p-3 h-full">
        <Card class="h-full">
            <template #header>
                <span>Inventory</span>
                <Button icon @click="$emit('on-close')">
                    <i class="fas fa-times"></i>
                </Button>
            </template>
            hello world
        </Card>
    </Panel>
</template>

<script lang="ts" setup>
import Panel from '../ui/panel.vue';
</script>
