You're traveling with a Svean noble, Isolde, who hired you to help her explore a town in the Sundered Lands, a blighted, poisonous region of the High Arctic.

With a soft <em>thunk</em>, the Skyship <em>Intrepid</em> makes a smooth landing near the edge of town.
~ setPortrait("isolde", "guarded")

The land around the blighted township of Grima looks just like what you expected: a desolate, gray wasteland, just like the rest of the Sundered Lands.

* [Head to the gangway.]
    -> gangway

=== gangway ===
Isolde is already at the gangway when you reach it.

"Stay close until we know what we're dealing with," she says tightly.

* ["You've been here before?"]
    She shakes her head. "Grima? It's a sundered town. I've read everything my father wrote about it, though. I know what it was."
    She doesn't say what it is <em>now</em>. What it's become.

* [Step off the gangway first.]
    She lets you step off the gangway first without argument. Whether it's trust or pragmatism, you can't tell.

- * [Continue.]
- -> arrival

=== arrival ===
As you step onto the rocks at the base of the gangway, you're hit by the sour smell of decay. Isolde  coughs violently before covering her face with a scarf.

- * [Enter the blighted town.]
- -> streets

=== streets ===
You move through the market street together.

Abandoned carts. A well with the rope cut. Doors hanging open.

Everywhere, the purple-gray ooze of blightrot lingers in the shadows. Grima is quiet in a way that makes the hair on your neck stand on end.

* ["What are we <em>actually</em> looking for?"]
    "We're looking for my father. Or whatever remains of him."
    Her voice doesn't waver. She's had time to prepare for that sentence.
    * * ["Tell me about your father."]
        "<em>Orin von Solveig</em>." She pronounces the name playfully, like she's teasing someone who's not there. "Merchant. Explorer. Stubborn to the point of embarrassment."
        She pauses and adjusts the cloth over her nose.
        "He set out for Grima six weeks ago chasing rumors of an artifact from before the Cataclysm. He sent one letter from Freehaven and then... nothing."

* [Say nothing. Keep scanning the rooftops.]
    She notices your silence. Approves, maybe.
    
- * [Continue.]
    
- Isolde shifts her weight, adjusting the channeling wand on her back. "I hired you in Freehaven as someone who knows how to navigate places like this. I suppose you have questions."

- -> asking_questions


=== asking_questions ===
VAR questions_asked = 0

* ["What does the artifact do?"]
    ~ questions_asked++
    Isolde shrugs. "I don't know. My father's notes are... incomplete. He was careful about what he committed to paper."
    She absentmindedly touches the satchel that hangs by her side.
    "I'm still working through them."
    * * ["And if someone else is looking for it?"]
    "Then we find it first."
    Short. Final. She's already considered this.
    * * ["If you say so."]
    She nods.

* ["What was he like, as an explorer?"]
    ~ questions_asked++
    Isolde is quiet for a moment.
    "Fearless. Recklessly so."
    * * ["Has he been in danger before?"]
        "He was in Murmansk when the Blight laid siege. One of the last ships out."
        She pauses.
        "He used to say it was the most terrifying thing he'd ever seen. Thousands of ghouls, moving as one."
        * * * ["And yet he kept exploring."]
            "He said it made him feel alive. That's the part I never understood."
            -> asking_questions
        * * * ["Didn't that slow him down?"]
            "For about a week." A thin, humorless smile. "Then he booked passage to Andaland."
            * * * * ["Andaland? He saw the giants?"]
                "Claims he did. I never knew whether to believe him."
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
    
* ["What do you know about Grima — before the Blight?"]
    ~ questions_asked++

+ [{ questions_asked == 0: "Not really. |"I don't have any other questions. } What do you need from me now?"]
    She turns to you. "Your eyes and your experience. I can handle the research. I can't handle..."
    She gestures broadly at the collapsed building to your left.
    "This."
    - * [Continue.]
    -> closing

- -> asking_questions



=== closing ===
Somewhere deeper in the village, something shifts. A sound too heavy for wind.

Isolde shoulders her satchel. "We should keep moving."

She draws her coat tight and walks forward without waiting for you.

-> END

// ---- External Function Stubs (for Inky preview only) ----
=== function setPortrait(character, mood) ===
~ return