<template>
    <ul>
        <li v-for="quest in quests" :key="quest.id">
            <h2>{{ quest.id }}</h2>
            <ul>
                <li v-for="(node, index) in quest['nodes']" :key="index">
                    <pre>{{ node }}</pre>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { quests } from '../narrator/narrative';
</script>
