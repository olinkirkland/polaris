import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Panel from './components/shared/panel.vue';
import Button from './components/ui/Button.vue';
import { useGameStore } from './store/game-store';
import { setupQuests } from './story/story';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
// app.use(i18n);
app.use(pinia);

// Components
app.component('Panel', Panel);
app.component('Button', Button);

// Stores
const gameStore = useGameStore();
gameStore.loadIndex();

// Setup
(async () => {
    await setupQuests();
    app.mount('#app');
})();
