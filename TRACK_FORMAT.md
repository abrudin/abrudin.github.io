# ABR 2 track files

`.abr` files are UTF-8 plain text. This is a small standalone format, not a LilyPond subset. The first nonblank, noncomment line is `ABR 2`. Metadata comes before exactly one `[upper]` and one `[lower]` section. Tracks may be empty, their order does not matter, and they can span multiple lines. ABR 1 files and the old `q` toggle are no longer supported.

```text
ABR 2
title: Four against three
tempo: 120
meter: 4/4
repeat: no
sustain: 0

[upper]
# Four groups of sixteenths make one complete 4/4 bar.
duration: 1/16
c5 d5 e5 f5 g5 a5 b5 c6 c6 b5 a5 g5 f5 e5 d5 c5 |

[lower]
duration: 1/12
c3 e3 g3 c3 e3 g3 c3 e3 g3 c3 e3 g3 |
```

## Metadata

All fields are optional, may appear in any order, and may occur only once. Unknown fields are rejected.

| Field | Meaning and default |
| --- | --- |
| `title:` | Single-line title, preserved when saving. Default: empty. |
| `tempo:` | Quarter-note beats per minute, from 30 to 4000. Default: 120. |
| `meter:` | Time signature. Numerator 1–32; denominator 1, 2, 4, 8, or 16. Default: `4/4`. Controls metronome accents and recording bar lengths. |
| `repeat:` | `yes` loops both tracks; `no` plays once and ends naturally. Default: `yes`. Recording accompaniment always loops. |
| `sustain:` | Optional hint from `-1` to `1`. `-1` shortens notes most; `0` preserves the original sample; positive values add reverb, up to maximum at `1`. If absent, the current slider setting is kept. Save includes its current setting. |

At a quarter-note tempo of 120 BPM, `6/8` has six metronome pulses per bar, each 250 ms apart. Recording requires a grid fine enough to represent a whole bar (for example, eighth notes for `3/8`). Keyboard layout and split settings are not stored.

## Track syntax

Whitespace separates events. Notes use lowercase names from `c1` through `d8`, with `#` for sharps. Commas form chords (`c3,e3,g3`). `r` is a rest. `s` explicitly stops both tracks; normally use `repeat: no` to finish a piece.

A line such as `duration: 1/8` sets the default duration for following events in that track, until another `duration:` line. The default resets to `1/4` at each playback loop. Duration directives must occupy their own lines.

Append `:duration` to override a single event. Durations are positive fractions of a whole note, or positive integers counting whole notes. Fraction denominators must divide 3840, supporting binary subdivisions, triplets, and quintuplets.

| Event | Timing |
| --- | --- |
| `c5:1/16` | Sixteenth note |
| `c5:1/8` | Eighth note |
| `c3:1/12` | Eighth-note triplet |
| `c5:3/8` | Dotted quarter note |
| `c3,e3,g3:1/2` | Chord for two quarter-note beats |
| `r:1/24` | Sixteenth-note triplet rest |

`|` is an optional visual bar separator and consumes no time. Bar lengths are not enforced, so it can also separate smaller groups. Lines starting with `#` (after optional whitespace) are comments. Inline comments are not supported, leaving note sharps unambiguous. Comments inside tracks survive saving.

Durations specify time until the next event, not independent note releases or ties. Sample decay follows sustain/reverb. Recording produces quarter-note events or `duration: 1/8` followed by eighth-note events. Starting playback pads the shorter track with an explicit-duration rest to match the longer track; comments, line breaks, and duration directives are preserved.

## Saving and loading

Save downloads `piano-tracks.abr` containing both tracks, tempo, meter, repeat, sustain, and a title if present. Load validates the complete file before replacing tracks and applying metadata, and stops recording, playback, and the metronome. Invalid files leave tracks and settings untouched. Files stay local; nothing is sent to a server.
