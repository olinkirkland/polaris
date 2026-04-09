export class Recipe {
    id: string;
    name: string;
    description: string;
    inputs: { id: string; quantity: number }[];
    outputs: { id: string; quantity: number }[];

    static unpack(data: any): Recipe {
        const r = new Recipe();
        r.id = data.id;
        r.name = data.name;
        r.description = data.description;
        r.inputs = data.inputs;
        r.outputs = data.outputs;
        return r;
    }
}
