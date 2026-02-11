import { Pin } from '@/components/pin/pin';

export interface GameContent {
    pins: Pin[];
    quests: { id: string }[]; // TODO
}

/**
 * Loads game content asynchronously
 * Content is merged sequentially, with ids overwritten by matches later in the load order
 * @param packages
 * @returns
 */
export async function loadGameContent(packages: { label: string; url: string }[]): Promise<GameContent> {
    let content: GameContent = {
        pins: [],
        quests: []
    };

    for (const p of packages) {
        const { label, url } = p;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`@loadGameContent: ${response.status}`);
            const data: GameContent = await response.json();
            content = mergeGameContent(content, data);
        } catch (error) {
            console.error(`Error fetching ${url}`, error);
        }
    }

    return content;
}

/**
 * Merges lists of GameContent b into lists of GameContent a
 * @param a
 * @param b
 * @returns
 */
function mergeGameContent(a: GameContent, b: Partial<GameContent>): GameContent {
    const listsToMerge = ['pins', 'quests'];
    listsToMerge.forEach((k) => {
        const key = k as keyof GameContent;
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

    return a as GameContent;
}
