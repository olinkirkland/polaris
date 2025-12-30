# Story System

The Story system tracks the state of each quest.

## Structure of a Quest
Quests contain multiple Nodes, which represent different stages within the Quest. Each Node contains a description, a list of Effects that occur when the Node is entered, and a list of Objectives (Conditions and their corresponding Effects).

- When a Node's success Conditions are met, the Quest progresses to the next connected Node.
- If a Node's failure Conditions are met, the Node will fail and the quest may fail.

### Automatic Progression
It automatically validates Quest states based on the game state (e.g., Flags, Inventory, Stats). This is triggered when certain changes are made  to the game state, such as completing a battle, acquiring an item, or visiting a location.

Trigger automatic Quest validation.

`Story.validateQuests(): void`

### Effects
Effects are actions that modify the game state. They can be associated with entering a node or completing an objective. Examples of effects include:

- Setting or unsetting flags
- Adding or removing items from the inventory
- Modifying player stats
- Changing locations
- Progressing to another node