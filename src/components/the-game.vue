<template>
    <ul class="quests">
        <li v-for="quest in quests" :key="quest.id">
            <h1>{{ quest.id }}</h1>
            <ul class="nodes">
                <li v-for="(node, index) in quest['nodes']" :key="index">
                    <Panel>
                        <div class="flex-column">
                            <strong>{{ node[1].id }}</strong>
                            <p>{{ node[1].description }}</p>
                            <Card class="flex-column" v-if="node[1].options">
                                <strong>Options</strong>
                                <ul class="grid">
                                    <Panel v-for="option in node[1].options" :key="option">
                                        <div class="flex-column">
                                            <em>{{ option.text }}</em>
                                            <strong>⤵️ {{ option.next }}</strong>
                                        </div>
                                    </Panel>
                                </ul>
                            </Card>
                            <Card v-if="node[1].subNodes">
                                <p>{{ node[1].type }}</p>
                                <ul class="grid">
                                    <li v-for="subNode in node[1].subNodes">
                                        <pre>{{ subNode }}</pre>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </Panel>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { quests } from '../story/story';
import Card from './card.vue';
</script>

<style lang="scss" scoped>
ul.quests > li {
    padding: 2rem;
}

ul.nodes {
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    gap: 1.2rem;
}
</style>
