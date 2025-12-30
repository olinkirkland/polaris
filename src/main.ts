import { createApp } from 'vue';
import App from './App.vue';
import { quests, setupQuests } from './story/story';
import { createPinia } from 'pinia';
import Card from './components/card.vue';
import Panel from './components/panel.vue';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
// app.use(i18n);
app.use(pinia);

// Components
app.component('Card', Card);
app.component('Panel', Panel);

// Setup
(async () => {
    await setupQuests();
    app.mount('#app');
})();
