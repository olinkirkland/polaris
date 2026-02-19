export class Zone {
    id: string;
    label: string;
    description: string;

    static unpack(data: any): Zone {
        const z = new Zone();
        Object.assign(z, data);
        return z;
    }

    pack(): string {
        return JSON.stringify(this);
    }
}
