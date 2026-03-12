export type Modifier = {
    target: string;
    value: number;
    op: 'SUM' | 'PERCENT'; // Raw values (+) get added to the base value first, and percentages (%) get summed separately and applied at the end, all at once. Total number is rounded down to the nearest integer.
    source: string; // The modifier stores the id of the source, for instance a skill, etc.
};

export class ModifierStack {
    modifiers: Modifier[];

    get value() {
        let flatSum = 0;
        let percentSum = 0;

        this.modifiers.forEach((m) => {
            if (m.op === 'SUM') flatSum += m.value;
            if (m.op === 'PERCENT') percentSum += m.value;
        });

        // Apply flat modifiers, then percentages, then floor
        const finalValue = flatSum * (1 + percentSum / 100);
        return Math.floor(finalValue);
    }

    addModifier(modifier: Modifier) {
        this.modifiers.push(modifier);
    }

    simplify() {
        const mergedMap = new Map<string, Modifier>();
        for (const mod of this.modifiers) {
            const id = `${mod.source}_${mod.op}`;
            if (mergedMap.has(id)) {
                const existing = mergedMap.get(id)!;
                existing.value += mod.value;
            } else mergedMap.set(id, { ...mod });
        }

        this.modifiers = Array.from(mergedMap.values());
    }
}
