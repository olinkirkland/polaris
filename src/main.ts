import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Card from './components/shared/card.vue';
import Button from './components/ui/button.vue';
import Checkbox from './components/ui/checkbox.vue';
import DotBadge from './components/ui/dot-badge.vue';
import { useGameDataStore } from './store/game-data-store';
import { useGameStore } from './store/game-store';
import { useStorageStore } from './store/storage-store';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
// app.use(i18n);
app.use(pinia);

// Components
app.component('Button', Button);
app.component('Checkbox', Checkbox);
app.component('Card', Card);
app.component('DotBadge', DotBadge);

// Stores
const storage = useStorageStore();
const game = useGameStore();
const gameData = useGameDataStore();

// Setup
(async () => {
    storage.load();
    app.mount('#app');
})();
