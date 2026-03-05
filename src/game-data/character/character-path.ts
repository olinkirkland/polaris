import { AttributeModifier } from '../attribute';

export class CharacterPath {
    id: string;
    label: string;
    description: string;
    attributeModifiers: AttributeModifier[];

    static unpack(data: any): CharacterPath {
        const p = new CharacterPath();
        p.id = data.id;
        p.label = data.label;
        p.description = data.description;
        p.attributeModifiers = data.attributeModifiers.map((a: any) => {
            return {
                key: a.key,
                value: a.value,
                source: `Path (${p.label})`
            };
        });

        return p;
    }
}
