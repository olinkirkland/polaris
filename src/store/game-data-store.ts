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
                const data: GameDataPackage = await response.json();
                result = mergePackageData(result, data);
            } catch (error) {
                console.error(`Error fetching ${url}`, error);
            }
        }

        data.value = result;
    }

    function resetGameData() {
        data.value = null;
    }

    return { loadGameDataPackages, resetGameData, data };
});

/**
 * Merges lists of GameContent b into lists of GameContent a
 */
function mergePackageData(a: GameData, b: GameDataPackage): GameData {
    // Pins, Quests
    const listsToMerge = ['pins', 'quests', 'zones'];
    listsToMerge.forEach((k) => {
        const key = k as keyof BaseGameData;
        const listA = a[key] as { id: string }[];
        const listB = b[key] as { id: string }[];
        if (listB) {
            listB.forEach((item) => {
                const { id } = item;
                const index = listA.findIndex((t) => t.id === id);
                if (index > -1) listA.splice(index, 1);
                listA.push(item);
            });
        }
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
        quests: []
    };
}
