import { Pin } from '@/game-data/pin/pin';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { useStorageStore } from './storage-store';

interface StoredGame {
    metadata: {
        id: string;
        label: string;
        date: number;
    };
    pins: any[];
    // quests: any[];
}

export const useGameStateStore = defineStore('game', () => {
    const gameData = useGameDataStore();
    const storage = useStorageStore();

    // Game Variables
    const id = ref<string | null>(null);
    const pins = ref<Pin[]>([]);

    function getPinsInZone(zone: string): Pin[] {
        if (!gameData.data) throw new Error('Missing Game Data');
        console.log(gameData.data.pins);
        return gameData.data.pins.filter((p) => p.address.zone === zone);
    }

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

        // Prepare data and put it into the data object to be packed
        const packages = gameData.data?.packageDescriptions;
        const date = Date.now();
        const metadata = { id: id.value, label: label, date, packages };
        const data: StoredGame = { metadata, pins: pins.value.map((p) => p.pack()) };

        localStorage.setItem(path, JSON.stringify(data));
        storage.save(path, label, date, packages);
    }

    function load(path: string) {
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        // Unpack the values from the loaded file
        id.value = g.metadata.id;
        pins.value = (g.pins as any[]).map((p) => Pin.unpack(p));
    }

    function remove(path: string) {
        localStorage.removeItem(path);
        storage.remove(path);
    }

    function reset() {
        // TODO: Reset the game values
        id.value = null;
        pins.value = [];
    }

    return { startNewGame, remove, save, load, reset, id, getPinsInZone };
});
