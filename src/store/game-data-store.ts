import { Heritage } from '@/character/character';
import { CharacterPath } from '@/game-data/character/character-path';
import { Pin } from '@/game-data/pin/pin';
import { Quest } from '@/game-data/quest/quest';
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

    characterPaths: CharacterPath[];
    characterHeritages: Heritage[];
    nameSuggestions: string[];

    // characterSkills: CharacterSkill[];
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
                const data: any = await response.json();
                const parsedData = unpackGameDataPackage(data);
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

    return { loadGameDataPackages, resetGameData, data, getZone };
});

function unpackGameDataPackage(data: any): GameDataPackage {
    const g: GameDataPackage = {
        packageDescription: data.packageDescription,
        pins: [],
        quests: [],
        zones: [],
        characterPaths: [],
        characterHeritages: [],
        nameSuggestions: []
    };

    g.pins = (data.pins || []).map((p: any) => Pin.unpack(p));
    g.quests = (data.quests || []).map((q: any) => Quest.unpack(q));
    g.zones = (data.zones || []).map((z: any) => Zone.unpack(z));
    g.characterPaths = (data.characterPaths || []).map((p: any) => CharacterPath.unpack(p));
    g.characterHeritages = data.characterHeritages || [];
    g.nameSuggestions = data.nameSuggestions || [];

    return g;
}

function mergePackageData(a: GameData, b: GameDataPackage): GameData {
    const listsToMerge = ['pins', 'quests', 'zones', 'characterPaths', 'characterHeritages'];
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

    const listsToConcatenate = ['nameSuggestions'];
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
        characterPaths: [],
        characterHeritages: [],
        nameSuggestions: []
    };
}
