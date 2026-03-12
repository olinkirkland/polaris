import { Modifier } from './modifier-stack';

export class CharacterPath {
    id: string;
    label: string;
    description: string;
    attributes: {};

    modifiers: Modifier[];

    static unpack(data: any): CharacterPath {
        const p = new CharacterPath();
        p.id = data.id;
        p.label = data.label;
        p.description = data.description;
        p.modifiers = data.modifiers.map((m: any) => {
            return {
                key: m.key,
                value: m.value,
                source: `Path (${p.label})`
            };
        });

        return p;
    }
}
