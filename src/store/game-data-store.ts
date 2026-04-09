import { CharacterPath } from '@/game-data/character/character-path';
import { Heritage } from '@/game-data/character/heritage';
import { Item } from '@/game-data/items/item';
import { Recipe } from '@/game-data/items/recipe';
import { Pin } from '@/game-data/pin/pin';
import { Quest } from '@/game-data/quest/quest';
import { Scene } from '@/game-data/scene/scene';
import { Zone } from '@/game-data/zone/zone';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface PackageDescription {
    id: string;
    label: string;
    summary: string;
}

// The core content structure contained in Game Data
export interface BaseGameData {
    pins: Pin[];
    zones: Zone[];
    quests: Quest[];
    scenes: Scene[];
    items: Item[];
    recipes: Recipe[];

    characterPaths: CharacterPath[];
    characterHeritages: Heritage[];
    nameSuggestions: string[];
    experienceRequiredPerLevel: number[];
}

// Individual Content Packs, optionally loaded (DLC support)
export interface GameDataPackage extends BaseGameData {
    packageDescription: PackageDescription;
}

// The merged Game Data Packages
export interface GameData extends BaseGameData {
    packageDescriptions: PackageDescription[];
}

export const useGameDataStore = defineStore('content', () => {
    const data = ref<GameData | null>(null);

    /**
     * Loads game content asynchronously
     * Content is merged sequentially, with ids overwritten by matches later in the load order
     */
    async function loadGameDataPackages(packageUrls: string[]) {
        let result: GameData = makeEmptyGameData();
        for (const url of packageUrls) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`@loadPackageData: ${response.status}`);
                const json: any = await response.json();
                const parsedData = await unpackGameDataPackage(json);
                result = mergePackageData(result, parsedData);
            } catch (error) {
                console.error(`Error parsing ${url}`, error);
            }
        }

        data.value = result;
    }

    function resetGameData() {
        data.value = null;
    }

    function getZone(id: string): Zone {
        const zone = data.value?.zones.find((z) => z.id === id);
        if (!zone) throw new Error(`@getZone: No such zone, id: ${id}`);
        return zone;
    }

    function getScene(id: string): Scene {
        const scene = data.value?.scenes.find((s) => s.id === id);
        if (!scene) throw new Error(`@getScene: No such scene, id: ${id}`);
        return scene as Scene;
    }

    return { loadGameDataPackages, resetGameData, data, getZone, getScene };
});

async function unpackGameDataPackage(data: any): Promise<GameDataPackage> {
    const g: GameDataPackage = {
        packageDescription: data.packageDescription,
        pins: [],
        quests: [],
        zones: [],
        scenes: [],
        items: [],
        recipes: [],
        characterPaths: [],
        characterHeritages: [],
        nameSuggestions: [],
        experienceRequiredPerLevel: []
    };

    g.pins = (data.pins || []).map((p: any) => Pin.unpack(p));
    g.quests = (data.quests || []).map((q: any) => Quest.unpack(q));
    g.scenes = await Promise.all((data.scenes || []).map((s: any) => Scene.unpack(s)));
    g.zones = (data.zones || []).map((z: any) => Zone.unpack(z));
    g.items = (data.items || []).map((t: any) => Item.unpack(t));
    g.recipes = (data.recipes || []).map((r: any) => Recipe.unpack(r));
    g.characterPaths = (data.characterPaths || []).map((p: any) => CharacterPath.unpack(p));
    g.characterHeritages = data.characterHeritages || [];
    g.nameSuggestions = data.nameSuggestions || [];
    g.experienceRequiredPerLevel = data.experienceRequiredPerLevel || [];

    return g;
}

function mergePackageData(a: GameData, b: GameDataPackage): GameData {
    // These lists will be merged; items with the same id get replaced
    const listsToMerge = ['pins', 'quests', 'zones', 'characterPaths', 'characterHeritages', 'scenes'];
    listsToMerge.forEach((k) => {
        const key = k as keyof BaseGameData;
        const listA = a[key] as { id: string }[];
        const listB = b[key] as { id: string }[];
        listB.forEach((item) => {
            const { id } = item;
            const index = listA.findIndex((t) => t.id === id);
            if (index > -1) listA.splice(index, 1);
            listA.push(item);
        });
    });

    // These lists are concatenated; the arrays are combined end to end with no overlap
    const listsToConcatenate = ['nameSuggestions', 'experienceRequiredPerLevel', 'items', 'recipes'];
    listsToConcatenate.forEach((k) => {
        const key = k as keyof BaseGameData;
        const listA = a[key] as any[];
        const listB = b[key] as any[];
        a[key] = listA.concat(listB);
    });

    // Package Descriptions
    a.packageDescriptions.push(b.packageDescription);

    return a as GameData;
}

function makeEmptyGameData(): GameData {
    return {
        packageDescriptions: [],
        pins: [],
        zones: [],
        quests: [],
        scenes: [],
        items: [],
        recipes: [],
        characterPaths: [],
        characterHeritages: [],
        nameSuggestions: [],
        experienceRequiredPerLevel: []
    };
}
