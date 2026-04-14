import InfoModal from '@/components/modals/templates/info-modal.vue';
import ModalController from '@/controllers/modal-controller';
import SaveOverlayController from '@/controllers/save-overlay-controller';
import { Character } from '@/game-data/character/character';
import { Item } from '@/game-data/items/item';
import { getExperienceToNextLevel } from '@/game-data/level';
import { Pin } from '@/game-data/pin/pin';
import { QuestState } from '@/game-data/quest/quest';
import { t } from '@/i18n/locale';
import { getNestedValue, setNestedValue } from '@/util/object-util';
import { wait } from '@/util/wait-util';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useGameDataStore } from './game-data-store';
import { StoredGame, StoredGameManifest, useStorageStore } from './storage-store';
import { Recipe } from '@/game-data/items/recipe';

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

    function getPinsInZone(zone: string | null): Pin[] {
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
            flags: {},
            level: 0,
            experience: -1,
            inventory: [],
            recipes: []
        };

        validateQuestConditions();
    }

    function addExperience(value: number) {
        const currentLevel: number = getValue('level');
        const experience: number = getValue('experience');
        const experienceToNextLevel: number = getExperienceToNextLevel(currentLevel);
        const newExperience = experience + value;
        if (newExperience >= experienceToNextLevel) {
            const newLevel = currentLevel + 1;

            // Level Up
            setValue('experience', newExperience - experienceToNextLevel);
            setValue('level', newLevel);

            getParty().forEach((c) => {
                const levelReward = c.characterPath?.progression[newLevel] || {};
                c.attributePoints += levelReward.attributePoints || 0;
                c.talentPoints += levelReward.talentPoints || 0;
                c.skillPoints += levelReward.skillPoints || 0;
                setCharacter(c);
            });

            // Trigger the modal for leveling up
            ModalController.open(InfoModal, {
                title: 'Leveled Up!',
                message: 'You leveled up from ' + currentLevel + ' to ' + newLevel
            });
        } else {
            // Don't level up
            setValue('experience', newExperience);
        }
    }

    function getMostRecentSave(): StoredGameManifest | null {
        if (storage.manifests.length === 0) return null;
        const sortedManifests = storage.manifests.sort((a, b) => b.date - a.date);
        const latestManifest = sortedManifests[0];
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

        const savingMessage = saveId === 'autosave' ? t('common.autosaving') : t('common.saving');
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

        const state = {
            ...gameState.value,
            party: gameState.value.party.map((c: Character) => c.pack())
        };
        const data: StoredGame = { manifest, state };

        localStorage.setItem(path, JSON.stringify(data));
        storage.saveManifest(manifest);

        await wait(0.5);
        SaveOverlayController.close();
    }

    function load(path: string) {
        console.log('@load:', path);
        const g: StoredGame = JSON.parse(localStorage.getItem(path)!);

        console.log(g);

        // Unpack the values from the loaded file
        id.value = g.manifest.id;
        gameState.value = g.state;

        // Just setting the gameState to the raw values covers almost all cases
        // but override some things that need class functions, e.g., party (Character)

        g.state.party.forEach((data: any) => {
            setCharacter(Character.unpack(data));
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
        const active = getValue('pins') as string[];
        const inactive = allPins?.filter((p) => (getValue('pins') as string[]).every((q) => q !== p));
        console.log('===', zone.value, '===');
        console.log('Active Pins', `(${active?.length || 0}/${allPins?.length || 0})`);
        console.log(active?.join('\n'));
        console.log('Inactive Pins', `(${inactive?.length || 0}/${allPins?.length || 0})`);
        console.log(inactive?.join('\n'));
    }

    function getParty(): Character[] {
        return getValue('party') as Character[];
    }

    function getCharacter(id: string): Character {
        const party = getValue('party') as Character[];
        const character = party.find((c) => c.id === id);
        if (!character) throw new Error(`Character does not exist: ${id}`);
        return character;
    }

    function setCharacter(newCharacter: Character) {
        console.log(newCharacter);
        patchValue('party', (party: Character[]) => {
            const exists = party.some((c: Character) => c.id === newCharacter.id);
            if (exists) return party.map((c: Character) => (c.id === newCharacter.id ? newCharacter : c));
            else return [...party, newCharacter];
        });
    }

    function removeCharacter(id: string) {
        // TODO: Remove character from party
        throw new Error('Function not implemented!');
    }

    function getActiveQuestNodeId(questId: string): string | undefined {
        const quests: QuestState[] = getValue('quests');
        const questState = quests.find((q: QuestState) => q.id === questId);
        return questState?.activeNodeId;
    }

    function setActiveQuestNodeId(questId: string, nodeId: string) {
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

    function getInventory() {
        return getValue('inventory') as Item[];
    }

    function getItem(itemId: string): Item | undefined {
        return getInventory().find((t) => t.id === itemId);
    }

    function addItem(newItem: Item) {
        const item = { ...newItem };
        if (!item.tags.some((t) => t === 'stackable')) {
            // Not stackable
            // Change the item's id to a uuid so it can't stack
            item.id = uuidv4();
        }

        // If there's an existing entry with this id, increment its quantity
        // Otherwise, create a new entry
        patchValue('inventory', (items: Item[]) => {
            const existingEntry = items.find((t) => t.id === item.id);
            if (existingEntry) existingEntry.quantity += newItem.quantity;
            else items.push(item);
            return [...items];
        });
    }

    function removeItem(itemId: string, quantityToRemove: number) {
        patchValue('inventory', (items: { id: string; quantity: number }[]) => {
            // Find and update the item
            const updatedItems = items.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: item.quantity - quantityToRemove };
                }
                return item;
            });

            // Filter out items with 0 or negative quantity
            return updatedItems.filter((item) => item.quantity > 0);
        });
    }

    function hasItems(items: { id: string; quantity: number }[]): boolean {
        // TODO
        return true;
    }

    function getRecipes(): Recipe[] {
        return getValue('recipes').map((id: string) => {
            return gameData.data?.recipes.find((r) => r.id === id) || null;
        });
    }

    function addRecipe(recipeId: string) {
        patchValue('recipes', (recipes: string[]) => {
            if (recipes.find((recipeId) => recipeId === recipeId)) return recipes;
            recipes.push(recipeId);
            return recipes;
        });
    }

    function craftRecipe(recipe: Recipe) {
        // TODO
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
        removeCharacter,
        getParty,
        getActiveQuestNodeId,
        setActiveQuestNodeId,
        getFlag,
        setFlag,
        getQuest,
        validateQuestConditions,
        addExperience,
        getInventory,
        addItem,
        getItem,
        removeItem,
        hasItems,
        getRecipes,
        addRecipe,
        craftRecipe
    };
});
