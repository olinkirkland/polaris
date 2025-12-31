<template>
    <ul class="quests">
        <li v-for="quest in quests" :key="quest.id">
            <Panel>
                <h1>{{ quest.title }}</h1>
                <ul class="nodes">
                    <li v-for="(node, nodeId) in quest.nodes" :key="nodeId">
                        <Panel class="flex-column">
                            <h3>
                                <em>{{ node.id }}</em>
                                : {{ node.description }}
                            </h3>
                            <div class="grid">
                                <Card v-if="node.objectives.length > 0">
                                    <em>Objectives</em>
                                    <ul>
                                        <li v-for="(objective, index) in node.objectives" :key="index">
                                            <p>{{ objective.description }}</p>
                                            <Panel
                                                v-for="(condition, cIndex) in objective.conditionsForSuccess"
                                                :key="`success-${cIndex}`"
                                                class="info-box"
                                            >
                                                <strong>Success Condition:</strong>
                                                <pre>{{ JSON.stringify(condition) }}</pre>
                                            </Panel>
                                        </li>
                                    </ul>
                                </Card>
                            </div>
                        </Panel>
                    </li>
                </ul>
            </Panel>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { quests } from '../story/story';
import Card from './shared/card.vue';
</script>

<style lang="scss" scoped>
ul.quests {
    padding: 1.2rem;
}

ul.nodes {
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    gap: 1.2rem;
}
</style>
