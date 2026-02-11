import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Card from './components/shared/card.vue';
import Button from './components/ui/Button.vue';
import Checkbox from './components/ui/Checkbox.vue';
import { useGameStore } from './store/game-store';
import { setupQuests } from './story/story';

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

// Stores
const gameStore = useGameStore();
gameStore.loadIndex();

// Setup
(async () => {
    await setupQuests();
    app.mount('#app');
})();
