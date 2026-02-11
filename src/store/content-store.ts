import { wait } from '@/util/wait-util';
import { defineStore } from 'pinia';

export interface PackageDescription {
    label: string;
    url: string;
}

export const useContentStore = defineStore('content', () => {
    async function loadPackages(packages: PackageDescription[]) {
        await wait(2);
    }

    return { loadPackages };
});
