# ABR track files

`.abr` files are UTF-8 plain text. The first line is `ABR 1`, followed by exactly one `[upper]` and one `[lower]` section. Either section may be empty; their order does not matter. Tracks can span multiple lines. Leading and trailing whitespace in each track is ignored.

```text
ABR 1
tempo: 120

[upper]
q c5 e5 g5 e5 q

[lower]
c3,e3,g3 r
```

Track tokens are separated by whitespace. Notes use lowercase names from `c1` through `d8`, with `#` for sharps. Commas join notes into chords. `r` is a rest, `q` toggles eighth-note mode, and `s` stops playback. Each playback loop begins in quarter-note mode.

## Explicit durations

Append `:duration` to a note, chord, or rest, expressed as a fraction of a whole note. For example, `:1/4` is a quarter note and `:1/16` is a sixteenth note. Tempo is measured in quarter-note beats per minute. Fraction denominators must divide 3840, supporting standard binary subdivisions, triplets, and quintuplets; positive integers represent whole notes (for example, `:2` is two whole notes).

Unmarked tokens default to quarter notes (`1/4`), or eighth notes (`1/8`) while enclosed by `q` markers. Explicit durations override `q` for that token; subsequent tokens still use the current `q` mode. `q` remains a toggle; `qq` is not currently supported.

| Token | Timing |
| --- | --- |
| `c5:1/16` | Sixteenth note |
| `c5:1/8` | Eighth note |
| `c3:1/12` | Eighth-note triplet |
| `c5:3/8` | Dotted quarter note |
| `c3,e3,g3:1/2` | Chord for two quarter-note beats |
| `r:1/24` | Sixteenth-note triplet rest |

For four notes against three over one quarter-note beat:

```text
ABR 1
tempo: 120

[upper]
c5:1/16 d5:1/16 e5:1/16 f5:1/16

[lower]
c3:1/12 e3:1/12 g3:1/12
```

Durations set the time until the next event; sample decay remains controlled by the sustain/reverb slider. They do not add independent note releases or ties. Recording continues to use the selected quarter/eighth-note grid. Loop padding accounts for explicit durations and may add fractional rests. Existing files and `q` syntax remain supported.

Files contain both tracks and the default playback tempo in BPM. The optional `tempo: 120` field goes before the track sections and must be between 30 and 4000. Save includes the current tempo; Load applies the file's tempo. Older files without this field keep the current tempo. Keyboard layout, split, recording grid, and sustain/reverb are not saved or changed when loading.

Save downloads `piano-tracks.abr`. Load reads a local file, validates both tracks and tempo, then replaces both textareas and stops recording, playback, and the metronome. Invalid files leave the tracks and tempo untouched. No file is sent to a server.
