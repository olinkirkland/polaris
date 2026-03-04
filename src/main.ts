import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Card from './components/shared/card.vue';
import Button from './components/ui/button.vue';
import Checkbox from './components/ui/checkbox.vue';
import DotBadge from './components/ui/dot-badge.vue';
import { useGameDataStore } from './store/game-data-store';
import { useGameStateStore } from './store/game-state-store';
import { useStorageStore } from './store/storage-store';
import ActionButton from './components/shared/action-button.vue';
import ActionController from './controllers/action-controller';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
// app.use(i18n);
app.use(pinia);

// Components
app.component('Button', Button);
app.component('ActionButton', ActionButton);
app.component('Checkbox', Checkbox);
app.component('Card', Card);
app.component('DotBadge', DotBadge);

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
