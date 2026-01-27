import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Panel from './components/shared/panel.vue';
import { setupQuests } from './story/story';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
// app.use(i18n);
app.use(pinia);

// Components
app.component('Panel', Panel);

// Setup
(async () => {
    await setupQuests();
    app.mount('#app');
})();
