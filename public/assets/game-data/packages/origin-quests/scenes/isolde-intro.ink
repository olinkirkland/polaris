// Variables
VAR questions_asked = 0
VAR asked_about_objective = false
VAR asked_about_artifact = false
VAR asked_about_father = false

The midday sun hangs high in a gray polar sky when Isolde's Skyship <em>the Intrepid</em> makes its landing near the edge of town with a soft <em>thunk</em>.

The land around the blighted township of Grima looks just like what you expected: a desolate, gray wasteland, just like the rest of the Sundered Lands. Time to get to work.

* [Head to the gangway.]
    -> gangway

=== gangway ===
# speaker:Isolde #speaker_description:Sharp-eyed and impatient.<br />Overdressed for this.
~ setPortrait("isolde", "guarded")

Isolde is already at the gangway when you reach it.

"Stay close until we know what we're dealing with," she says tightly.
-> gangway_comments

=== gangway_comments ===
* ["Nice landing."]
    She nods, barely acknowledging the compliment. Her thoughts are elsewhere.
    -> gangway_comments

* ["You've been here before?"]
    She shakes her head. "Grima? I've never been west of Svea, or north of Polaris. I've read everything my father wrote about this town, though. I know what it used to be."
    She doesn't say what it is <em>now</em>. What it's become.

* [Step off the gangway first.]
    She lets you step off without argument. Whether it's trust or pragmatism, you can't tell.

- * [Continue.]
- -> arrival

=== arrival ===
As you step onto the rocks at the base of the gangway, you're hit by the sour smell of decay. Isolde coughs violently before covering her face with a scarf.

* [Enter the blighted town.]
    -> streets


=== streets ===

You lead Isolde quietly through the empty market street.

Everywhere, the purple-gray ooze of blightrot lingers in the shadows under abandoned carts and under the sills of broken windows. Grima is quiet in a way that makes the hair on your neck stand on end.

* [Examine the blightrot on the walls.]
    You crouch near a doorframe. The ooze is dry at the edges. It's old, but in some places, scaly patches glisten.
    "Don't touch it," Isolde says. Her voice trembles ever so slightly.
    * * Touch it anyways.
        The rot blisters and cracks at your touch. You know it's safe enough, as long as there aren't demons about. Isolde flinches disapprovingly.
        * * * ["It's safe."]
            She nods. Still, Isolde looks ill at ease. "I know that. It's just... I've only read about it in books."
        * * * Say nothing.
    
    * * [Back off.]
        "I know it's technically only dangerous if there's a demon nearby. Still..." She eyes the ooze apprehensively. "I've only read about it in books."

* [Look for footprints.]
    The ground is ash and loose rock. If anyone came through here recently, the wind took the evidence.
    Isolde watches you work in silence for a few minutes.

- * [Continue.]

- She shifts her weight, adjusting the heavy channeling staff she carries. "I hired you in Freehaven because you know how to navigate places like this. I suppose you have questions."

- -> asking_questions


=== asking_questions ===

* ["What exactly are we looking for out here?"]
    ~ questions_asked++
    ~ asked_about_objective = true
    "My father, Orin von Solveig. He came to Grima six weeks ago and hasn't been heard from since."
    She adjusts the satchel at her side.
    "And the artifact he was tracking. Pre-Cataclysm, origin unknown. That's what brought him here in the first place."
    -> asking_questions

* { asked_about_objective } ["What does the artifact do?"]
    ~ questions_asked++
    ~ asked_about_artifact = true
    Isolde shrugs. "I don't know. My father's notes are... incomplete. He was careful about what he committed to paper."
    She absentmindedly touches the satchel that hangs by her side.
    "I'm still working through them."
    * * ["And if someone else is looking for it?"]
        "Then we find it first."
        Short. Final. She's already considered this.
        -> asking_questions
    * * ["If you say so."]
        She nods.
        -> asking_questions

* { asked_about_objective } ["What was your father like, as an explorer?"]
    ~ questions_asked++
    ~ asked_about_father = true
    Isolde is quiet for a moment.
    "Fearless. Recklessly so."
    * * ["Has he been in danger before?"]
        "He was in Murmansk when the Blight laid siege. One of the last ships out. He used to say it was the most terrifying thing he'd ever seen. Thousands of ghouls, moving as one."
        * * * ["That didn't give him second thoughts about being an explorer?"]
            "For about a week." A thin, humorless smile. "Then he booked passage to Andaland."
            * * * * ["Andaland? He saw the giants?"]
                "Claims he did. I never knew whether to believe him."
                She glances toward the ruined buildings around you.
                "I believe him now."
                -> asking_questions
            * * * * ["Sounds like he had a death wish."]
                "No. He had curiosity. There's a difference."
                She says it like she's had to defend him before.
                -> asking_questions
    * * ["He sounds difficult to worry about."]
        "Impossible. You can't worry about someone who doesn't worry about themselves. He's walked away from ghouls, demons, and giants. I told myself Aren would be no different."
        Isolde sighs.
        "I'm not sure I believe that anymore."
        -> asking_questions

* ["Why come yourself? You could have hired someone to do this alone."]
    ~ questions_asked++
    "Because he's my father." No hesitation.
    She looks ahead, scanning the empty street.
    "And because I'm the only one who has his notes. No one else could read his handwriting anyway."
    -> asking_questions

* ["What do you know about Grima, <em>before</em> the Blight?"]
    ~ questions_asked++
    "Fishing village, mostly. A few hundred people. It was already in decline before the Sundering."
    She steps over a collapsed beam in the road.
    "My father believed something was buried here long before any of that. Something old."
    ~ asked_about_artifact = true
    -> asking_questions

+ [{ questions_asked == 0: "Not really." | "I don't have any other questions." } What do you need from me now?]
    -> pre_closing

- -> asking_questions


=== pre_closing ===
// Fill in what the player didn't ask about
{ asked_about_father == false:
    She turns to you, as if suddenly aware she hasn't explained herself properly.
    "My father is Orin von Solveig, the famous explorer. He came to Grima six weeks ago. I haven't heard from him since he left Freehaven to come here."
    A pause.
    "I need to know what happened to him."
}
{ asked_about_artifact == false:
    "There's an artifact, too. Pre-Cataclysm. It drew him here in the first place. I don't know what it does, only that he thinks it's important enough to risk coming to the Sundered Lands for it."
}
She turns to you. "Your eyes and your experience, that's what I need. I can handle the research. I can't handle..."
She gestures at the collapsed building to your left.
"This. Survival. I need someone to help me set up camp, and with sharper eyes than my own."
-> closing


=== closing ===
A sound cuts through the silence. Low. Wet. Close.

Isolde goes still. Her hand moves to her staff as three shapes emerge from the shadows of a decrepit building. Lurching, wrong, trailing threads of blightrot. Ghouls.

* ["Get back!"]
    You step in front of her. She doesn't argue.
    -> fight

* [Draw your weapon.]
    No words needed. Isolde is already beside you, staff raised.
    -> fight

=== fight ===
~ startBattle("grima_ghouls")

-> END

// ---- External Function Stubs (for Inky preview only) ----
=== function setPortrait(character, mood) ===
~ return
=== function startBattle(encounter) ===
~ return