export class Modifier {
    readonly source: string;
    readonly target: string;
    readonly op: 'SUM' | 'PERCENT';
    readonly statPointer?: string;
    readonly rawValue?: number;

    constructor(params: {
        source: string;
        target: string;
        op: 'SUM' | 'PERCENT';
        statPointer?: string;
        rawValue?: number;
    }) {
        if (params.statPointer === undefined && params.rawValue === undefined) {
            throw new Error(`Modifier ${params.source} / ${params.target} must have either statPointer or rawValue`);
        }
        Object.assign(this, params);
    }

    static unpack(data: Omit<Modifier, 'resolve'>): Modifier {
        return new Modifier(data);
    }

    resolve(getStat: (id: string) => Stat): number {
        if (this.statPointer) return getStat(this.statPointer).getValue(getStat);
        return this.rawValue!;
    }
}

export class Stat {
    readonly id: string;

    private modifiers: Modifier[] = [];

    constructor(id: string) {
        this.id = id;
    }

    pack() {
        return {
            id: this.id,
            modifiers: this.modifiers
        };
    }

    static unpack(data: ReturnType<Stat['pack']>): Stat {
        const stat = new Stat(data.id);
        stat.modifiers = data.modifiers.map(Modifier.unpack);
        return stat;
    }

    getValue(getStat: (id: string) => Stat): number {
        let flatSum = 0;
        let percentSum = 0;

        for (const m of this.modifiers) {
            const v = m.resolve(getStat);
            if (m.op === 'SUM') flatSum += v;
            else percentSum += v;
        }

        return Math.floor(flatSum * (1 + percentSum / 100));
    }

    getModifiers() {
        return this.modifiers;
    }

    addModifier(m: Modifier) {
        this.modifiers.push(m);
    }

    removeBySource(sourceId: string) {
        this.modifiers = this.modifiers.filter((m) => m.source !== sourceId);
    }
}

export class StatsRegister {
    private stats = new Map<string, Stat>();

    pack() {
        return Array.from(this.stats.values()).map((s) => s.pack());
    }

    static unpack(data: ReturnType<StatsRegister['pack']>): StatsRegister {
        const register = new StatsRegister();
        for (const statData of data) {
            register.register(Stat.unpack(statData));
        }
        return register;
    }

    register(stat: Stat) {
        if (this.stats.has(stat.id)) {
            throw new Error(`Stat '${stat.id}' already registered`);
        }
        this.stats.set(stat.id, stat);
    }

    getStat(statId: string): Stat {
        const stat = this.stats.get(statId);
        if (!stat) throw new Error(`Unknown stat: '${statId}'`);
        return stat;
    }

    getValue(statId: string): number {
        return this.getStat(statId).getValue(this.getStat.bind(this));
    }

    applyModifiers(modifiers: any[]) {
        for (const m of modifiers) {
            this.getStat(m.target).addModifier(new Modifier(m));
        }
    }

    removeModifiers(sourceId: string) {
        for (const stat of this.stats.values()) {
            stat.removeBySource(sourceId);
        }
    }
}
