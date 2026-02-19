export class Quest {
    id: string;

    static unpack(data: any): Quest {
        const q = new Quest();
        q.id = data.id;
        return q;
    }

    pack(): string {
        return JSON.stringify(this);
    }
}
