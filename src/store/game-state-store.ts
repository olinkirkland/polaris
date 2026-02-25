import { Pin } from '@/game-data/pin/pin';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { useStorageStore } from './storage-store';

interface StoredGame {
    metadata: {
        id: string;
        label: string;
        date: number;
    };
    state: { [key: string]: any };
}

export const useGameStateStore = defineStore('game', () => {
    const gameData = useGameDataStore();
    const storage = useStorageStore();

    // Game Variables
    const id = ref<string | null>(null);
    const state = ref<{ [key: string]: any }>({});

    // Computed values (from state)
    const zone = computed(() => {
        const z = state.value.zone;
        if (!z) return null;
        return gameData.getZone(getValue('zone') as string);
    });

    function getValue(key: string): any {
        return state.value[key];
    }

    function setValue(key: string, value: any) {
        state.value[key] = value;
    }

    function patchValue(key: string, f: (oldValue: any) => any) {
        const currentValue = getValue(key);
        const newValue = f(currentValue);
        setValue(key, newValue);
    }

    function getPins(): Pin[] {
        if (!gameData.data) throw new Error('Missing Game Data');
        return gameData.data.pins.filter((p) => (getValue('pins') as string[]).indexOf(p.id) > -1);
    }

    function getPinsInZone(zone: string): Pin[] {
        return getPins().filter((p) => p.address.zone === zone);
    }

    function startNewGame() {
        // Load an initial state
        // (the way the game starts)
        id.value = uuidv4();

        state.value = {
            zone: 'bear-island',
            pins: ['bear-island', 'bear-island.return']
        };

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
        const data: StoredGame = { metadata, state: state.value };

        localStorage.setItem(path, JSON.stringify(data));
        storage.save(path, label, date, packages);
    }

    function load(path: string) {
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        // Unpack the values from the loaded file
        id.value = g.metadata.id;
        state.value = g.state;
    }

    function remove(path: string) {
        localStorage.removeItem(path);
        storage.remove(path);
    }

    function reset() {
        // TODO: Reset the game values
        id.value = null;
        state.value = {};
    }

    function addPin(id: string) {
        patchValue('pins', (pins) => [...(pins as string[]), id]);
    }

    function removePin(id: string) {
        patchValue('pins', (pins) => (pins as string[]).filter((p) => p !== id));
    }

    function listPins() {
        const allPins = gameData.data?.pins.map((p) => p.id);
        const active = getValue('pins');
        const inactive = allPins?.filter((p) => (getValue('pins') as string[]).every((q) => q !== p));
        return { active, inactive };
    }

    return {
        startNewGame,
        remove,
        save,
        load,
        reset,
        id,
        getPinsInZone,
        addPin,
        removePin,
        zone,
        state,
        listPins,
        getValue,
        setValue,
        patchValue
    };
});
