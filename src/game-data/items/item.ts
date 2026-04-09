import { Modifier } from '@/stats/stats-register';

export class Item {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    icon: string;
    slots: string[] | null;
    price: number;
    modifiers: Modifier[];
    ability: null; // TODO: A combat ability is unlocked by using this item, how to define abilities?
    quantity: number; // This is used by the inventory for stackable items

    static unpack(data: any): Item {
        const t = new Item();
        t.id = data.id;
        t.name = data.name;
        t.description = data.description;
        t.category = data.category;
        t.tags = data.tags;
        t.icon = 'assets/images/icons/items/' + data.icon;
        t.slots = data.slots || [];
        t.price = data.price || 0;
        t.modifiers = data.modifiers?.map((m: any) => {
            m.source = `item:${t.id}`;
            return m;
        });
        t.ability = data.ability; // TODO: Parse this properly
        t.quantity = data.quantity || 1; // Default is 1
        return t;
    }
}
