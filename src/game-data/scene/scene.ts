import { Story } from 'inkjs';
import { Compiler } from 'inkjs/compiler/Compiler';

export class Scene {
    id: string;
    url: string;
    story: Story;

    static async unpack(data: any): Promise<Scene> {
        const s = new Scene();
        s.id = data.id;
        s.url = data.url;
        s.story = await Scene.downloadStory(s.url);
        return s;
    }

    static async downloadStory(url: string): Promise<Story> {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`@Scene.download: ${response.status}`);
        const data: any = await response.text();
        // Use ink.js to parse the ink story data
        return new Compiler(data).Compile();
    }
}
