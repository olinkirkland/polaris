export type Attribute = 'brawn' | 'agility' | 'wits' | 'aura';

export interface AttributeModifier {
    key: Attribute;
    value: string;
    source: string;
}
