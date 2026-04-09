export class Recipe {
    id: string;

    static unpack(data: any): Recipe {
        const r = new Recipe();
        r.id = data.id;
        return r;
    }
}
