import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PackageDescription } from './game-data-store';

interface StoredGameManifest {
    path: string;
    label: string;
    date: number;
    packageIds: string[];
}

export const useStorageStore = defineStore('index', () => {
    const indexes = ref<StoredGameManifest[]>([]);

    function save(path: string, label: string, date: number, packages: PackageDescription[]) {
        indexes.value = [...indexes.value, { path, label, date, packageIds: packages.map((p) => p.id) }];
        localStorage.setItem('storage-index', JSON.stringify(indexes.value));
    }

    function load() {
        indexes.value = JSON.parse(localStorage.getItem('storage-index') || '[]');
    }

    function remove(path: string) {
        indexes.value = indexes.value.filter((v) => v.path !== path);
        localStorage.setItem('storage-index', JSON.stringify(indexes.value));
    }

    return { save, load, remove, indexes };
});
