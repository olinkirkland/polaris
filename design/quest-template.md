Quest Manager
1.	The main quest is hardcoded and will automatically be started when a new game is started. 
2.	getQuestById(id:Int): Starts a quest and sets the first task to active
3.	validateActiveTasks: Loop through all active tasks and check their success and fail conditions
a.	If anything was changed, repeat until there are no changes
Quest
1.	Name, Id
2.	Array of tasks
Task
1.	Id
2.	Text
3.	Description
4.	Success conditions: If inventory contains at least 4 wolf pelts, then start task 21920
5.	Fail condition: If this condition is met, make this task inactive and return to a previous task in the quest: If inventory contains less than 4 wolf pelts, then deactivate this task and make the active task 10020
Examples:
The Hunter’s Debt
Help the hunter Hans pay back his debt to the local lord.
1.	Visit the hunter’s hut in Brucking and speak with Hans Pracht, the village hunter.
a.	Go to task #2
2.	After discovering that Hans is in debt to the local lord, you can help him pay off his debt.
a.	Go to task #3
b.	Go to task #4
3.	Acquire 4 wolf pelts.
a.	Go to task #5
4.	Speak with Berndt Specht, the lord of Brucking and pay off Hans’ debt (25 gold)
a.	Go to task #6
5.	Give the wolf pelts to Hans.
a.	Receive 250 xp and a Hunter’s Heirloom necklace
6.	Return to the hunter’s hut in Brucking and let Hans know that his debt is paid.
a.	Receive 250 xp and a Hunter’s Heirloom necklace
A Village in Peril
1.	Enter the village of Brucking.
The Woodsman’s Lament
Help find the hatchet your companion ____ left behind on the island they were marooned on. (Hatchet inspiration, companion quest)
Main Quest
 
PLOT: It’s what’s left when you strip away everything but what happens; Big Bad -> End of the world -> Hero saves the day.
CHARACTER: The aspect of game-writing that fleshes out characters and makes them feel wholistic and believable. Comes at expense of the plot, ex. Doesn’t actually move the plot forward and this is OK.
LORE: Lore is everything that makes the world feel vibrant and alive. Makes the player feel like the world exists outside of the time and place the player is exploring.

“Imperfectly formed, half understood, poorly remembered. In the years to come, the story of the Crown Killer will be twisted and bent; hammered like soft metal.”
