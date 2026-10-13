# ABR track files

`.abr` files are UTF-8 plain text. The first line is `ABR 1`, followed by exactly one `[upper]` and one `[lower]` section. Either section may be empty; their order does not matter. Tracks can span multiple lines. Leading and trailing whitespace in each track is ignored.

```text
ABR 1

[upper]
q c5 e5 g5 e5 q

[lower]
c3,e3,g3 r
```

Track tokens are separated by whitespace. Notes use lowercase names from `c1` through `d8`, with `#` for sharps. Commas join notes into chords. `r` is a rest, `q` toggles eighth-note mode, and `s` stops playback. Each playback loop begins in quarter-note mode.

Files contain only the two tracks. Tempo, keyboard layout, split, recording grid, and sustain/reverb remain application settings and are not saved or changed when loading.

Save downloads `piano-tracks.abr`. Load reads a local file, validates both tracks, then replaces both textareas and stops recording, playback, and the metronome. Invalid files leave the tracks untouched. No file is sent to a server.
