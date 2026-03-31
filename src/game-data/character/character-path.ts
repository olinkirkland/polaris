import { LevelReward } from '../level';

export class CharacterPath {
    id: string;
    label: string;
    description: string;
    attributes: {};

    progression: LevelReward[];

    static unpack(data: any): CharacterPath {
        const p = new CharacterPath();
        p.id = data.id;
        p.label = data.label;
        p.description = data.description;
        p.progression = data.progression.map((r: LevelReward, index: number) => {
            r.modifiers = r.modifiers?.map((m: any) => {
                m.source = `path:${p.id}:${index}`;
                return m;
            });
            return r;
        });

        return p;
    }
}
