(function () {
    var button = document.getElementById("midiToggle");
    var selector = document.getElementById("midiInput");
    var field = document.getElementById("midiInputField");
    var status = document.getElementById("midiStatus");
    var access = null;
    var input = null;
    var notes = new Map();

    function clearNotes() {
        notes.forEach(function (note) {
            if (note.key) note.key.classList.remove("midi-held");
            if (note.source) note.source.stop();
        });
        notes.clear();
    }

    function releaseNote(id) {
        var note = notes.get(id);
        if (!note) return;
        notes.delete(id);
        if (note.key && !Array.from(notes.values()).some(function (other) { return other.key === note.key; })) {
            note.key.classList.remove("midi-held");
        }
    }

    function message(event) {
        var data = event.data;
        if (data.length < 3) return;
        var command = data[0] & 0xf0;
        var id = (data[0] & 0x0f) + ":" + data[1];
        if (command === 0x80 || (command === 0x90 && data[2] === 0)) {
            releaseNote(id);
            return;
        }
        if (command === 0xb0 && (data[1] === 120 || data[1] === 123)) {
            clearNotes();
            return;
        }
        if (command !== 0x90 || notes.has(id)) return;
        // MIDI C2 is note 36. MIDI pitches bypass computer-keyboard transposition.
        var index = data[1] - 36;
        var name = noteForPianoIndex(index);
        if (!name || !playFns[name]) return;
        if (audioCtx.state === "suspended") audioCtx.resume();
        var key = pianoKeys[index];
        recordNote(name);
        var source = playFns[name](data[2] / 127);
        notes.set(id, { key: key, source: source });
        if (key) key.classList.add("midi-held");
    }

    function selectInput() {
        clearNotes();
        if (input) {
            input.onmidimessage = null;
            input.close().catch(function () {});
        }
        input = access ? access.inputs.get(selector.value) : null;
        if (input && input.state === "connected") {
            input.onmidimessage = message;
            status.textContent = "Connected to " + (input.name || "MIDI input") + ". MIDI notes use their original pitch; arm a track to record.";
        } else {
            input = null;
            status.textContent = "No MIDI inputs found. Connect your keyboard and it will appear here.";
        }
    }

    function refreshInputs() {
        var selected = selector.value;
        selector.textContent = "";
        access.inputs.forEach(function (port) {
            if (port.state !== "connected") return;
            var option = document.createElement("option");
            option.value = port.id;
            option.textContent = port.name || "MIDI input";
            selector.appendChild(option);
        });
        if (access.inputs.has(selected) && access.inputs.get(selected).state === "connected") selector.value = selected;
        selector.disabled = !selector.options.length;
        if (!input || input.id !== selector.value || input.state !== "connected") selectInput();
    }

    selector.addEventListener("change", function () { selectInput(); selector.blur(); });
    button.addEventListener("click", async function () {
        if (access) {
            access.onstatechange = null;
            access = null;
            selectInput();
            field.hidden = true;
            button.textContent = "Connect MIDI";
            button.setAttribute("aria-pressed", "false");
            status.textContent = "MIDI disconnected.";
            return;
        }
        button.disabled = true;
        try {
            access = await navigator.requestMIDIAccess({ sysex: false });
            access.onstatechange = refreshInputs;
            field.hidden = false;
            button.textContent = "Disconnect MIDI";
            button.setAttribute("aria-pressed", "true");
            if (audioCtx.state === "suspended") audioCtx.resume();
            refreshInputs();
        } catch (error) {
            status.textContent = "Could not connect MIDI: " + error.message;
        } finally {
            button.disabled = false;
        }
    });

    if (!window.isSecureContext || !navigator.requestMIDIAccess) {
        button.disabled = true;
        status.textContent = "MIDI requires HTTPS and a browser with Web MIDI support.";
    }
    window.addEventListener("blur", clearNotes);
})();
