<template>
    <ul>
        <li v-for="quest in quests" :key="quest.id">
            <h2>{{ quest.id }}</h2>
            <ul>
                <li v-for="(node, index) in quest['nodes']" :key="index">
                    <pre>{{ node[1].id }}</pre>
                    <p>{{ node[1].description }}</p>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { quests } from '../narrator/narrative';
</script>
