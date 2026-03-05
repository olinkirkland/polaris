import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface StoredGameManifest {
    id: string;
    label: string;
    path: string; // id + / + label
    date: number;
    packageIds: string[];
    summary: {
        name?: string;
        level?: number;
        path?: string;
    };
}

export interface StoredGameManifestGroup {
    id: string; // All manifests in this group share this id
    manifests: StoredGameManifest[];
}

export interface StoredGame {
    manifest: StoredGameManifest;
    state: { [key: string]: any };
}

export const useStorageStore = defineStore('index', () => {
    const manifests = ref<StoredGameManifest[]>([]);
    const manifestGroups = computed(() => {
        const groups: StoredGameManifestGroup[] = [];
        manifests.value.forEach((m) => {
            const g = groups.find((g) => g.id === m.id);
            if (g) g.manifests.push(m);
            else groups.push({ id: m.id, manifests: [m] });
        });
        groups.forEach((g) => g.manifests.sort((a, b) => (a.date > b.date ? -1 : 1)));
        return groups;
    });

    function saveManifest(manifest: StoredGameManifest) {
        // Overwrite manifests with the same path
        manifests.value = manifests.value.filter((m) => m.path !== manifest.path);
        manifests.value = [...manifests.value, manifest];
        localStorage.setItem('storage-index', JSON.stringify(manifests.value));
    }

    function loadManifests() {
        manifests.value = JSON.parse(localStorage.getItem('storage-index') || '[]');
    }

    function remove(path: string) {
        manifests.value = manifests.value.filter((v) => v.path !== path);
        localStorage.setItem('storage-index', JSON.stringify(manifests.value));
        localStorage.removeItem(path);
    }

    return { saveManifest, loadManifests, remove, manifests, manifestGroups };
});
