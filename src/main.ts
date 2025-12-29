import { createApp } from 'vue';
import App from './App.vue';
import { quests, setupQuests } from './narrator/narrative';

(async () => {
    await setupQuests();
    console.log(quests);
    createApp(App).mount('#app');
})();
