export class Zone {
    id: string;

    static unpack(data: any): Zone {
        const z = new Zone();
        z.id = data.id;
        return z;
    }

    pack(): string {
        return JSON.stringify(this);
    }
}
