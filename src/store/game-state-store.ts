import { Character } from '@/character/character-types';
import { Pin } from '@/game-data/pin/pin';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { StoredGame, StoredGameManifest, useStorageStore } from './storage-store';

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
            party: [], // Empty party
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
        const player = getCharacter('player');
        const summary = {
            name: player?.name,
            path: player?.path,
            level: player?.level
        };
        const manifest: StoredGameManifest = {
            id: id.value,
            label: label,
            path,
            date,
            packageIds: packages.map((p) => p.id),
            summary
        };

        const data: StoredGame = { manifest, state: state.value };

        localStorage.setItem(path, JSON.stringify(data));
        storage.saveManifest(manifest);
    }

    function load(path: string) {
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        // Unpack the values from the loaded file
        id.value = g.manifest.id;
        state.value = g.state;
    }

    function remove(path: string) {
        localStorage.removeItem(path);
        storage.remove(path);
    }

    function reset() {
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

    function getCharacter(id: string): Character | null {
        const party = getValue('party') as Character[];
        return party.find((c) => c.id === id) || null;
    }

    function setCharacter(updatedCharacter: Character) {
        const party = getValue('party') as Character[];
        const newParty = party.map((c) => (c.id === updatedCharacter.id ? updatedCharacter : c));
        setValue('party', newParty);
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
