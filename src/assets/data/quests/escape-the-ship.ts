import { Quest, QuestNode } from '@/story/story-types';

export default <Quest>{
    id: 'quest_001',
    title: 'Escape the Ship',
    nodes: [
        {
            id: 'node_001',
            description:
                "I find myself a prisoner on the Syndicate cruiser 'Hand of Sorrow'. The ship is under attack by unknown forces, and in the chaos my cell was breached by debris.",
            effects: [
                
            ],
            objectives: [
                {
                    description: 'Defeat the jailer.',
                    successMode: 'all',
                    conditionsForSuccess: [{ type: 'flag', flag: 'jailer_defeated' }],
                    effectsOnSuccess: [{ type: 'setFlag', flag: 'defeated_jailer' }]
                }
            ]
        }
    ] as QuestNode[]
};
