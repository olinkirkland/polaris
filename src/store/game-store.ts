import { Pin } from '@/components/pin/pin';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
    const storageIndex = ref<{ path: string; label: string; date: number }[]>([]);
    const currentGameId = ref<string | null>(null); // Distinguishes this game from other games (e.g., characters, slots)

    const pins = ref<Pin[]>([]);

    function loadIndex() {
        storageIndex.value = JSON.parse(localStorage.getItem('storage-index') || '[]');
    }

    function startNewGame() {
        // Load the initial state
        // (the way the game starts)
        currentGameId.value = uuidv4();
        // pins.value = [];

        save('autosave', 'Autosave');
    }

    function save(saveId: string, label: string) {
        const path = currentGameId.value + '/' + saveId;
        localStorage.setItem(
            path,
            JSON.stringify({ gameId: currentGameId.value, label, pins: pins.value, date: Date.now() })
        );
        storageIndex.value = [...storageIndex.value, { path, label, date: Date.now() }];
        localStorage.setItem('storage-index', JSON.stringify(storageIndex.value));
    }

    function load(path: string) {
        const g: any = JSON.parse(localStorage.getItem(path)!);
        currentGameId.value = g.gameId;
        pins.value = (g.pins as any[]).map((p) => Pin.from(p));
    }

    function remove(path: string) {
        storageIndex.value = storageIndex.value.filter((v) => v.path !== path);
        localStorage.setItem('storage-index', JSON.stringify(storageIndex.value));
        localStorage.removeItem(path);
    }

    function reset() {
        currentGameId.value = null;
        pins.value = [];
    }

    return { startNewGame, loadIndex, remove, storageIndex, save, load, reset, id: currentGameId, pins };
});
