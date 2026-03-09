import { Character } from '@/character/character';
import SaveOverlayController from '@/controllers/save-overlay-controller';
import { Pin } from '@/game-data/pin/pin';
import { QuestState } from '@/game-data/quest/quest';
import { getNestedValue, setNestedValue } from '@/util/object-util';
import { wait } from '@/util/wait-util';
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
    const gameState = ref<{ [key: string]: any }>({});

    // Computed values (from state)
    const zone = computed(() => {
        const z = gameState.value.zone;
        if (!z) return null;
        return gameData.getZone(getValue('zone') as string);
    });

    function getValue(key: string): any {
        return getNestedValue(gameState.value, key);
    }

    function setValue(key: string, value: any) {
        return setNestedValue(gameState.value, key, value);
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

        gameState.value = {
            party: [], // Empty party
            zone: null,
            quests: [],
            pins: [],
            flags: {}
        };

        validateQuestConditions();
    }

    function getMostRecentSave(): StoredGameManifest | null {
        if (storage.manifests.length === 0) return null;
        const latestManifest = storage.manifests[0];
        return latestManifest;
    }

    function validateQuestConditions() {
        console.log('@gameState.validateQuestConditions');
        const quests = gameData.data?.quests || [];
        quests.forEach((q) => q.validate());
    }

    async function save(saveId: string, label: string) {
        if (!id.value) throw new Error('Missing gameId');
        if (!gameData.data) throw new Error('Missing game data');

        const savingMessage = label === 'Autosave' ? 'Autosaving...' : 'Saving...';
        SaveOverlayController.open(savingMessage);

        const path = id.value + '/' + saveId;

        // Prepare data and put it into the data object to be packed
        const packages = gameData.data?.packageDescriptions;
        const date = Date.now();
        const player = getCharacter('player');
        const summary = {
            name: player?.name,
            path: player?.characterPath?.label
            // level: player?.level
        };
        const manifest: StoredGameManifest = {
            id: id.value,
            label: label,
            path,
            date,
            packageIds: packages.map((p) => p.id),
            summary
        };

        const data: StoredGame = { manifest, state: gameState.value };

        localStorage.setItem(path, JSON.stringify(data));
        storage.saveManifest(manifest);

        await wait(0.5);
        SaveOverlayController.close();
    }

    function load(path: string) {
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        // Unpack the values from the loaded file
        id.value = g.manifest.id;
        gameState.value = g.state;
        
        // Just setting the gameState to the raw values covers almost all cases
        // but override some things that need class functions, e.g., party (Character)
        
        g.state.party.forEach((data: any) => {
            const character = new Character();
            Object.assign(character, data);
            setCharacter(character);
        });
    }

    function reset() {
        id.value = null;
        gameState.value = {};
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

    function setCharacter(newCharacter: Character) {
        patchValue('party', (party: Character[]) => {
            const exists = party.some((c: Character) => c.id === newCharacter.id);
            if (exists) return party.map((c: Character) => (c.id === newCharacter.id ? newCharacter : c));
            else return [...party, newCharacter];
        });
    }

    function getActiveNodeId(questId: string): string | undefined {
        const quests: QuestState[] = getValue('quests');
        const questState = quests.find((q: QuestState) => q.id === questId);
        return questState?.activeNodeId;
    }

    function setActiveNodeId(questId: string, nodeId: string) {
        patchValue('quests', (quests: QuestState[]) => {
            const existingQuestIndex = quests.findIndex((q) => q.id === questId);

            if (existingQuestIndex === -1)
                return [...quests, { id: questId, activeNodeId: nodeId, traversedNodeIds: [nodeId] }];

            return quests.map((q, index) => {
                if (index === existingQuestIndex) {
                    const alreadyTraversed = q.traversedNodeIds?.includes(nodeId);
                    const traversedNodeIds = alreadyTraversed ? q.traversedNodeIds : [...q.traversedNodeIds, nodeId];
                    return { ...q, activeNodeId: nodeId, traversedNodeIds };
                }
                return q;
            });
        });

        // Perform actions
        const quest = gameData.data?.quests.find((q) => q.id === questId);
        const activeNode = quest?.getActiveNode();
        const actions = activeNode?.actions;
        console.log('@gameState.setActiveNodeId', questId, nodeId);
        if (actions) actions.forEach((a) => a.act());

        // Validate quests afterwards
        validateQuestConditions();
    }

    function getFlag(name: string): string | number | boolean {
        return getValue('flags')[name];
    }

    function setFlag(name: string, value: string | number | boolean) {
        patchValue('flags', (flags) => ({ ...flags, [name]: value }));
    }

    function getQuest(questId: string): QuestState {
        return getValue('quests').find((q: QuestState) => q.id === questId);
    }

    return {
        startNewGame,
        getMostRecentSave,
        save,
        load,
        reset,
        id,
        getPinsInZone,
        addPin,
        removePin,
        zone,
        state: gameState,
        listPins,
        getValue,
        setValue,
        patchValue,
        getCharacter,
        setCharacter,
        getActiveNodeId,
        setActiveNodeId,
        getFlag,
        setFlag,
        getQuest,
        validateQuestConditions
    };
});
