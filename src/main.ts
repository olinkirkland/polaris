import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import ActionDescription from './components/ui/action-description.vue';
import Button from './components/ui/button.vue';
import Card from './components/ui/card.vue';
import Checkbox from './components/ui/checkbox.vue';
import Flag from './components/ui/flag.vue';
import ActionController from './controllers/action-controller';
import i18n from './i18n/locale';
import { useGameStateStore } from './store/game-state-store';
import { useStorageStore } from './store/storage-store';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
app.use(i18n);
app.use(pinia);

// Components
app.component('Button', Button);
app.component('ActionDescription', ActionDescription);
app.component('Checkbox', Checkbox);
app.component('Card', Card);
app.component('Flag', Flag);

// Stores
const storage = useStorageStore();
const gameState = useGameStateStore();

(window as any).g = gameState; // Expose game state
(window as any).a = ActionController.getInstance(); // Expose the action controller

// Setup
(async () => {
    storage.loadManifests();
    app.mount('#app');
})();
