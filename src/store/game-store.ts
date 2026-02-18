import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { useStorageStore } from './storage-store';

export const useGameStore = defineStore('game', () => {
    const gameData = useGameDataStore();
    const storage = useStorageStore();

    // Game Variables
    const id = ref<string | null>(null);

    function startNewGame() {
        // Load an initial state
        // (the way the game starts)
        id.value = uuidv4();

        save('autosave', 'Autosave');
    }

    function save(saveId: string, label: string) {
        if (!id.value) throw new Error('Missing gameId');
        if (!gameData.data) throw new Error('Missing game data');

        const path = id.value + '/' + saveId;

        // TODO: Put data in here to be serialized
        const packages = gameData.data?.packageDescriptions;
        const data = { gameId: id.value, label, date: Date.now(), packages };

        storage.save(path, label, packages);
        localStorage.setItem(path, JSON.stringify(data));
    }

    function load(path: string) {
        const g = JSON.parse(localStorage.getItem(path)!);
        // TODO: Deserialize data here

        id.value = g.gameId;
        // pins.value = (g.pins as any[]).map((p) => Pin.from(p));
    }

    function remove(path: string) {
        localStorage.removeItem(path);
        storage.remove(path);
    }

    function reset() {
        // TODO: Reset the game values
        id.value = null;
    }

    return { startNewGame, remove, save, load, reset, id };
});
