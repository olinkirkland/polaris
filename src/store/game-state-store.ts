import { ActionType, BaseAction } from '@/actions/base-action';
import { GoToZoneAction } from '@/actions/go-to-zone-action';
import ActionController from '@/controllers/action-controller';
import { Pin } from '@/game-data/pin/pin';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { useStorageStore } from './storage-store';

type StateValue = string | number | boolean | null;

interface StoredGame {
    metadata: {
        id: string;
        label: string;
        date: number;
    };
    pins: string[];
    stateValues: { [key: string]: StateValue };
}

export const useGameStateStore = defineStore('game', () => {
    const gameData = useGameDataStore();
    const storage = useStorageStore();

    // Game Variables
    const id = ref<string | null>(null);
    const pins = ref<string[]>([]);
    const stateValues = ref<{ [key: string]: StateValue }>({});
    const zone = computed(() => {
        const z = stateValues.value.zone;
        if (!z) return null;
        return gameData.getZone(getValue('zone') as string);
    });

    function getValue(key: string): StateValue {
        return stateValues.value[key];
    }

    function setValue(key: string, value: StateValue) {
        stateValues.value[key] = value;
    }

    // Listen to the action controller
    ActionController.getInstance().addEventListener((action) => onActionReceived(action));

    function onActionReceived(action: BaseAction) {
        switch (action.type) {
            case ActionType.GO_TO_ATLAS:
                setValue('zone', null);
                break;
            case ActionType.GO_TO_ZONE:
                setValue('zone', (action as GoToZoneAction).id);
                break;
        }
    }

    function getPins(): Pin[] {
        if (!gameData.data) throw new Error('Missing Game Data');
        return gameData.data.pins.filter((p) => pins.value.indexOf(p.id) > -1);
    }

    function getPinsInZone(zone: string): Pin[] {
        return getPins().filter((p) => p.address.zone === zone);
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
        const data: StoredGame = { metadata, pins: pins.value, stateValues: stateValues.value };

        localStorage.setItem(path, JSON.stringify(data));
        storage.save(path, label, date, packages);
    }

    function load(path: string) {
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        // Unpack the values from the loaded file
        id.value = g.metadata.id;
        pins.value = g.pins;
        setValue('zone', g.zone ? gameData.getZone(g.zone) : null);
    }

    function remove(path: string) {
        localStorage.removeItem(path);
        storage.remove(path);
    }

    function reset() {
        // TODO: Reset the game values
        id.value = null;
        pins.value = [];
        zone.value = null;
    }

    function addPin(id: string) {
        pins.value.push(id);
    }

    function removePin(id: string) {
        pins.value = pins.value.filter((p) => p !== id);
    }

    function listPins() {
        const allPins = gameData.data?.pins.map((p) => p.id);
        const active = [...pins.value];
        const inactive = allPins?.filter((p) => pins.value.every((q) => q !== p));
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
        stateValues,
        listPins,
        stateValues
    };
});
