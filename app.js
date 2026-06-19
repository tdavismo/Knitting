(function () {
  "use strict";

  /* ============================================================
   * Built-in sample pattern: Daphne lace scarf
   * ========================================================== */
  var DAPHNE_ROWS = [
    "P2, k5, p5, k4, p3, k9, p2",
    "K2, p7, p2tog, inc 1, k2, p4, k2, yo, k1, yo, k2, p5, k2",
    "P2, k5, p7, k4, p2, k1, p1, k8, p2",
    "K2, p6, p2tog, k1, inc 1 ps, k2, p4, k3, yo, k1, yo, k3, p5, k2",
    "P2, k5, p9, k4, p2, k2, p1, k7, p2",
    "K2, p5, p2tog, k1, inc 1 ps, p1, k2, p4, ssk, k5, k2tog, p5, k2",
    "P2, k5, p7, k4, p2, k3, p1, k6, p2",
    "K2, p4, p2tog, k1, inc 1 ps, p2, k2, p4, ssk, k3, k2tog, p5, k2",
    "P2, k5, p5, k4, p2, k4, p1, k5, p2",
    "K2, p5, yo, k1, yo, p4, k2, p4, ssk, k1, k2tog, p5, k2",
    "P2, k5, p3, k4, p2, k4, p3, k5, p2",
    "K2, p5, (k1, yo) twice, k1, p4, k1, m1, k1, p2tog, p2, sk2p, p5, k2",
    "P2, k9, p3, k4, p5, k5, p2",
    "K2, p5, k2, yo, k1, yo, k2, p4, k1, inc 1, k1, p2tog, p7, k2",
    "P2, k8, p1, k1, p2, k4, p7, k5, p2",
    "K2, p5, k3, yo, k1, yo, k3, p4, k2, inc 1 ps, k1, p2tog, p6, k2",
    "P2, k7, p1, k2, p2, k4, p9, k5, p2",
    "K2, p5, ssk, k5, k2tog, p4, k2, p1, inc 1 ps, k1, p2tog, p5, k2",
    "P2, k6, p1, k3, p2, k4, p7, k5, p2",
    "K2, p5, ssk, k3, k2tog, p4, k2, p2, inc 1 ps, k1, p2tog, p4, k2",
    "P2, k5, p1, k4, p2, k4, p5, k5, p2",
    "K2, p5, ssk, k1, k2tog, p4, k2, p4, yo, k1, yo, p5, k2",
    "P2, k5, p3, k4, p2, k4, p3, k5, p2",
    "K2, p5, sk2p, p2, p2tog, k1, m1, k1, p4, (k1, yo) twice, k1, p5, k2"
  ];

  var DAPHNE_GLOSSARY = [
    ["P2tog", "Purl two stitches together."],
    ["Inc 1", "Knit into the front and the back of the same stitch."],
    ["Yo", "Yarn over. Wrap the yarn over the right-hand needle."],
    ["Inc 1 ps", "Purl into the front and the back of the same stitch."],
    ["Ssk", "Slip, slip, knit. Slip the next two stitches knitwise to the right needle, return them, and knit them together."],
    ["K2tog", "Knit two stitches together."],
    ["M1", "Make one: pick up the yarn between two stitches with the left needle and knit into the back of it."],
    ["Sk2p", "Slip the first stitch, knit the next two together, pass the slipped stitch over. Decreases two stitches."]
  ];

  /* ============================================================
   * Helpers
   * ========================================================== */

  // Split a row string into stitch groups on commas, keeping
  // parenthesised groups like "(k1, yo) twice" intact.
  function splitGroups(s) {
    var groups = [], depth = 0, cur = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { groups.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    if (cur.trim()) groups.push(cur.trim());
    return groups;
  }

  function newId() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // Build a project object from raw fields.
  function makeProject(name, intro, repeats, rowStrings, glossary) {
    return {
      id: newId(),
      name: name || "Untitled pattern",
      intro: intro || "",
      repeats: Math.max(1, repeats | 0) || 1,
      rows: rowStrings.map(splitGroups),
      glossary: glossary || [],
      currentRepeat: 1,
      cursors: {} // repeat number -> step index (0..totalSteps)
    };
  }

  function flatten(proj) {
    var f = [];
    proj.rows.forEach(function (groups, ri) {
      groups.forEach(function (text, gi) { f.push({ ri: ri, gi: gi, text: text }); });
    });
    return f;
  }

  function totalSteps(proj) {
    return proj.rows.reduce(function (sum, g) { return sum + g.length; }, 0);
  }

  function getCursor(proj) {
    return proj.cursors[proj.currentRepeat] || 0;
  }

  function setCursor(proj, c) {
    var max = totalSteps(proj);
    proj.cursors[proj.currentRepeat] = Math.max(0, Math.min(c, max));
    save();
  }

  /* ============================================================
   * Storage (with migration from the v1 single-pattern format)
   * ========================================================== */
  var KEY = "knit-tracker-v2";
  var OLD_KEY = "daphne-stitch-tracker-v1";

  var store = loadStore();

  function loadStore() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects)) return parsed;
      }
    } catch (e) { /* fall through to fresh/migrated store */ }

    var s = { projects: [], activeId: null };
    var daphne = makeProject("Daphne", "Cast on 30 stitches. Bind off and weave in ends when done.", 12, DAPHNE_ROWS, DAPHNE_GLOSSARY);

    // Non-destructive migration of any saved v1 progress into the Daphne project.
    try {
      var oldRaw = localStorage.getItem(OLD_KEY);
      if (oldRaw) {
        var old = JSON.parse(oldRaw);
        if (old && old.progress) {
          daphne.currentRepeat = old.currentRepeat || 1;
          var max = totalSteps(daphne);
          Object.keys(old.progress).forEach(function (rep) {
            var rowsMap = old.progress[rep] || {};
            var done = 0;
            Object.keys(rowsMap).forEach(function (ri) {
              var arr = rowsMap[ri] || [];
              for (var i = 0; i < arr.length; i++) if (arr[i]) done++;
            });
            // v1 allowed gaps; the cursor model is linear, so we keep the
            // number of completed groups and treat them as the first N done.
            daphne.cursors[rep] = Math.min(done, max);
          });
        }
      }
    } catch (e) { /* ignore malformed old data */ }

    s.projects.push(daphne);
    s.activeId = daphne.id;
    return s;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* storage full / disabled */ }
  }

  function activeProject() {
    return store.projects.filter(function (p) { return p.id === store.activeId; })[0] || null;
  }

  /* ============================================================
   * View switching
   * ========================================================== */
  function showLibrary() {
    document.body.dataset.view = "library";
    document.getElementById("libraryView").hidden = false;
    document.getElementById("trackerView").hidden = true;
    closeKnit();
    renderLibrary();
  }

  function openProject(id) {
    store.activeId = id;
    save();
    document.body.dataset.view = "tracker";
    document.getElementById("libraryView").hidden = true;
    document.getElementById("trackerView").hidden = false;
    buildTracker();
    refreshTracker();
    window.scrollTo(0, 0);
  }

  /* ============================================================
   * Library rendering
   * ========================================================== */
  var listEl = document.getElementById("projectList");

  function renderLibrary() {
    listEl.innerHTML = "";
    if (!store.projects.length) {
      var empty = document.createElement("p");
      empty.className = "lib-note";
      empty.textContent = "No projects yet. Import a pattern PDF to begin.";
      listEl.appendChild(empty);
      return;
    }
    store.projects.forEach(function (proj) {
      var max = totalSteps(proj);
      var doneOverall = 0;
      for (var r = 1; r <= proj.repeats; r++) doneOverall += Math.min(proj.cursors[r] || 0, max);
      var pct = max && proj.repeats ? Math.round((doneOverall / (max * proj.repeats)) * 100) : 0;

      var card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML =
        '<div class="pc-main">' +
          '<h3></h3>' +
          '<div class="pc-meta"></div>' +
          '<div class="pc-bar"><div class="pc-fill"></div></div>' +
        '</div>' +
        '<div class="pc-go">›</div>';
      card.querySelector("h3").textContent = proj.name;
      card.querySelector(".pc-meta").textContent =
        proj.rows.length + " rows · " + proj.repeats + " repeat" + (proj.repeats === 1 ? "" : "s") + " · " + pct + "% done";
      card.querySelector(".pc-fill").style.width = pct + "%";
      card.addEventListener("click", function () { openProject(proj.id); });
      listEl.appendChild(card);
    });
  }

  /* ============================================================
   * Tracker rendering
   * ========================================================== */
  var rowsEl = document.getElementById("rows");
  var repeatNumEl = document.getElementById("repeatNum");
  var repeatTotalEl = document.getElementById("repeatTotal");
  var repeatPrevEl = document.getElementById("repeatPrev");
  var repeatNextEl = document.getElementById("repeatNext");
  var progressFillEl = document.getElementById("progressFill");
  var progressTextEl = document.getElementById("progressText");

  function buildTracker() {
    var proj = activeProject();
    if (!proj) { showLibrary(); return; }

    document.getElementById("projTitle").textContent = proj.name;
    document.getElementById("projSubtitle").textContent =
      proj.rows.length + " rows · repeat " + proj.repeats + "×";
    document.getElementById("repeatTotal").textContent = proj.repeats;

    var introEl = document.getElementById("introText");
    introEl.textContent = proj.intro || ("Work the " + proj.rows.length + " rows, then repeat " + proj.repeats + " times.");

    // Glossary
    var box = document.getElementById("glossaryBox");
    var dl = document.getElementById("glossaryList");
    dl.innerHTML = "";
    if (proj.glossary && proj.glossary.length) {
      proj.glossary.forEach(function (pair) {
        var dt = document.createElement("dt"); dt.textContent = pair[0];
        var dd = document.createElement("dd"); dd.textContent = pair[1];
        dl.appendChild(dt); dl.appendChild(dd);
      });
      box.hidden = false;
    } else {
      box.hidden = true;
    }

    // Rows + chips. Each chip carries its flat step index.
    rowsEl.innerHTML = "";
    var flatIndex = 0;
    proj.rows.forEach(function (groups, rowIdx) {
      var card = document.createElement("section");
      card.className = "row-card";
      card.dataset.row = rowIdx;

      var head = document.createElement("div");
      head.className = "row-head";
      var num = document.createElement("span");
      num.className = "row-number";
      num.textContent = "Row " + (rowIdx + 1);
      head.appendChild(num);
      var badge = document.createElement("span");
      badge.className = "row-badge";
      badge.textContent = "done";
      badge.style.display = "none";
      head.appendChild(badge);
      var count = document.createElement("span");
      count.className = "row-count";
      head.appendChild(count);
      card.appendChild(head);

      var groupsEl = document.createElement("div");
      groupsEl.className = "groups";
      groups.forEach(function (text, groupIdx) {
        var fi = flatIndex++;
        var chip = document.createElement("button");
        chip.className = "chip";
        chip.dataset.flat = fi;
        var idx = document.createElement("span");
        idx.className = "chip-index";
        idx.textContent = "S" + (groupIdx + 1);
        chip.appendChild(idx);
        var label = document.createElement("span");
        label.className = "chip-text";
        label.textContent = text;
        chip.appendChild(label);
        chip.addEventListener("click", function () { onChipClick(fi); });
        groupsEl.appendChild(chip);
      });
      card.appendChild(groupsEl);
      rowsEl.appendChild(card);
    });
  }

  function onChipClick(flatIndex) {
    var proj = activeProject();
    var c = getCursor(proj);
    // Cursor model: tapping an undone group marks through it; tapping a
    // done group rolls the cursor back to just before it.
    if (flatIndex < c) setCursor(proj, flatIndex);
    else setCursor(proj, flatIndex + 1);
    refreshTracker();
  }

  function refreshTracker() {
    var proj = activeProject();
    if (!proj) return;
    var cursor = getCursor(proj);
    var max = totalSteps(proj);

    repeatNumEl.textContent = proj.currentRepeat;
    repeatPrevEl.disabled = proj.currentRepeat <= 1;
    repeatNextEl.disabled = proj.currentRepeat >= proj.repeats;

    // Which row holds the cursor (the active row).
    var activeRow = proj.rows.length; // default: all complete
    var acc = 0;
    for (var i = 0; i < proj.rows.length; i++) {
      var len = proj.rows[i].length;
      if (cursor < acc + len) { activeRow = i; break; }
      acc += len;
    }

    var cards = rowsEl.querySelectorAll(".row-card");
    cards.forEach(function (card) {
      var rowIdx = +card.dataset.row;
      var chips = card.querySelectorAll(".chip");
      var doneInRow = 0;
      chips.forEach(function (chip) {
        var fi = +chip.dataset.flat;
        var done = fi < cursor;
        if (done) doneInRow++;
        chip.classList.toggle("done", done);
        chip.classList.toggle("next", fi === cursor);
        chip.setAttribute("aria-pressed", done ? "true" : "false");
      });
      var complete = doneInRow === chips.length && chips.length > 0;
      card.classList.toggle("complete", complete);
      card.classList.toggle("active", rowIdx === activeRow);
      card.querySelector(".row-badge").style.display = complete ? "" : "none";
      card.querySelector(".row-count").textContent = doneInRow + "/" + chips.length;
    });

    var pct = max ? Math.round((cursor / max) * 100) : 0;
    progressFillEl.style.width = pct + "%";
    progressTextEl.textContent =
      (cursor >= max ? "Repeat complete 🎉" : "Row " + (activeRow + 1)) + " · " + pct + "%";

    if (!document.getElementById("knitMode").hidden) refreshKnit();
  }

  function changeRepeat(delta) {
    var proj = activeProject();
    var next = proj.currentRepeat + delta;
    if (next < 1 || next > proj.repeats) return;
    proj.currentRepeat = next;
    save();
    refreshTracker();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============================================================
   * Knitting mode (full-screen, tap to advance)
   * ========================================================== */
  var knitEl = document.getElementById("knitMode");

  function openKnit() {
    knitEl.hidden = false;
    refreshKnit();
  }
  function closeKnit() {
    knitEl.hidden = true;
  }

  function refreshKnit() {
    var proj = activeProject();
    if (!proj) return;
    var flat = flatten(proj);
    var cursor = getCursor(proj);
    var max = flat.length;

    var metaEl = document.getElementById("knitMeta");
    var rowLabelEl = document.getElementById("knitRowLabel");
    var groupEl = document.getElementById("knitGroup");
    var stepEl = document.getElementById("knitStep");
    var ctxEl = document.getElementById("knitRowContext");
    var nextEl = document.getElementById("knitNext");

    groupEl.classList.remove("complete");
    nextEl.innerHTML = "";
    ctxEl.innerHTML = "";

    if (cursor >= max) {
      // Repeat finished.
      metaEl.textContent = "Repeat " + proj.currentRepeat + " / " + proj.repeats;
      rowLabelEl.textContent = "";
      groupEl.classList.add("complete");
      stepEl.textContent = max + " of " + max + " steps";
      if (proj.currentRepeat < proj.repeats) {
        groupEl.textContent = "Repeat " + proj.currentRepeat + " complete";
        var btn = document.createElement("button");
        btn.className = "knit-cta";
        btn.textContent = "Start repeat " + (proj.currentRepeat + 1);
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          proj.currentRepeat += 1;
          save();
          refreshTracker();
          refreshKnit();
        });
        nextEl.appendChild(btn);
      } else {
        groupEl.textContent = "Pattern complete 🎉";
      }
      return;
    }

    var step = flat[cursor];
    metaEl.textContent =
      "Repeat " + proj.currentRepeat + " / " + proj.repeats +
      " · Row " + (step.ri + 1) + " / " + proj.rows.length;
    rowLabelEl.textContent = "Row " + (step.ri + 1) + " — S" + (step.gi + 1);
    groupEl.textContent = step.text;
    stepEl.textContent = "step " + (cursor + 1) + " of " + max;

    // Context: the current row's groups with the current one highlighted.
    var rowGroups = proj.rows[step.ri];
    var rowStart = cursor - step.gi; // flat index of this row's first group
    rowGroups.forEach(function (text, gi) {
      var span = document.createElement("span");
      span.className = "kc";
      var fi = rowStart + gi;
      if (fi < cursor) span.classList.add("done");
      if (gi === step.gi) span.classList.add("current");
      span.textContent = text;
      ctxEl.appendChild(span);
    });

    // Next preview.
    if (cursor + 1 < max) {
      var n = flat[cursor + 1];
      var nlabel = n.ri === step.ri ? n.text : "Row " + (n.ri + 1) + ": " + n.text;
      nextEl.textContent = "Next: " + nlabel;
    } else {
      nextEl.textContent = "Last step of this repeat";
    }
  }

  function knitAdvance() {
    var proj = activeProject();
    if (getCursor(proj) >= totalSteps(proj)) return; // at end; use the CTA
    setCursor(proj, getCursor(proj) + 1);
    refreshTracker();
  }
  function knitReverse() {
    var proj = activeProject();
    setCursor(proj, getCursor(proj) - 1);
    refreshTracker();
  }

  /* ============================================================
   * Import / manual entry modal
   * ========================================================== */
  var modal = document.getElementById("modal");
  var statusEl = document.getElementById("modalStatus");
  var fName = document.getElementById("fieldName");
  var fIntro = document.getElementById("fieldIntro");
  var fRepeats = document.getElementById("fieldRepeats");
  var fRows = document.getElementById("fieldRows");

  function openModal(title) {
    document.getElementById("modalTitle").textContent = title;
    modal.hidden = false;
  }
  function closeModal() {
    modal.hidden = true;
    statusEl.textContent = "";
    statusEl.className = "modal-status";
  }
  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "modal-status" + (kind ? " " + kind : "");
  }

  function openManual() {
    fName.value = "";
    fIntro.value = "";
    fRepeats.value = "1";
    fRows.value = "";
    setStatus("Paste your rows below, one per line.", "");
    openModal("Add pattern");
  }

  // Save handler reads whatever is in the form (works for both PDF-prefilled
  // and fully manual entry).
  function saveFromModal() {
    var name = fName.value.trim();
    var rowsText = fRows.value;
    var rowStrings = parseRowsFromText(rowsText);
    if (!rowStrings.length) {
      setStatus("No rows found. Add at least one line like “Row 1 — k2, p2”.", "error");
      return;
    }
    var proj = makeProject(name, fIntro.value.trim(), parseInt(fRepeats.value, 10) || 1, rowStrings, []);
    store.projects.push(proj);
    save();
    closeModal();
    openProject(proj.id);
  }

  // Turn a block of text into row strings, accepting either "Row N — ..."
  // lines or plain one-row-per-line input.
  function parseRowsFromText(text) {
    var lines = text.split(/\r?\n/);
    var rows = [];
    var rowRe = /^\s*Row\s+\d+\s*[—–\-:.]?\s*(.+)$/i;
    lines.forEach(function (line) {
      var t = line.trim();
      if (!t) return;
      var m = t.match(rowRe);
      rows.push(m ? m[1].trim() : t);
    });
    return rows;
  }

  /* ---------- PDF extraction (client-side via PDF.js) ---------- */
  function importPdf(file) {
    if (typeof pdfjsLib === "undefined") {
      openManual();
      setStatus("Couldn’t load the PDF reader (no network?). You can paste the rows manually instead.", "error");
      return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    var defaultName = file.name.replace(/\.pdf$/i, "");
    openModal("Import “" + defaultName + "”");
    fName.value = defaultName;
    fIntro.value = "";
    fRepeats.value = "1";
    fRows.value = "";
    setStatus("Reading PDF…", "");

    var reader = new FileReader();
    reader.onload = function () {
      var data = new Uint8Array(reader.result);
      pdfjsLib.getDocument({ data: data }).promise
        .then(extractLines)
        .then(function (lines) {
          var parsed = parsePattern(lines);
          if (!parsed.rows.length) {
            setStatus("Couldn’t detect rows automatically. Paste or edit them below, then add.", "error");
            return;
          }
          fRows.value = parsed.rows.map(function (r, i) { return "Row " + (i + 1) + " — " + r; }).join("\n");
          if (parsed.intro) fIntro.value = parsed.intro;
          if (parsed.repeats) fRepeats.value = parsed.repeats;
          setStatus("Found " + parsed.rows.length + " rows" +
            (parsed.repeats ? ", repeating " + parsed.repeats + "×" : "") +
            ". Review and tap “Add project”.", "ok");
        })
        .catch(function (err) {
          setStatus("Couldn’t read that PDF (" + (err && err.message ? err.message : "error") + "). Paste the rows manually below.", "error");
        });
    };
    reader.onerror = function () { setStatus("Couldn’t open that file. Try pasting the rows manually.", "error"); };
    reader.readAsArrayBuffer(file);
  }

  // Reconstruct text lines from a PDF document, ordering by page then by
  // vertical position, inserting spaces from glyph geometry.
  function extractLines(pdf) {
    var pagePromises = [];
    for (var p = 1; p <= pdf.numPages; p++) pagePromises.push(pdf.getPage(p));
    return Promise.all(pagePromises).then(function (pages) {
      return Promise.all(pages.map(function (page) { return page.getTextContent(); }));
    }).then(function (contents) {
      var lines = [];
      contents.forEach(function (tc) {
        var items = tc.items
          .filter(function (it) { return it.str && it.str.trim() !== ""; })
          .map(function (it) {
            return { str: it.str, x: it.transform[4], y: it.transform[5], w: it.width || 0 };
          });
        items.sort(function (a, b) { return Math.abs(a.y - b.y) > 3 ? b.y - a.y : a.x - b.x; });
        var cur = null, curY = null, prev = null;
        items.forEach(function (it) {
          if (curY === null || Math.abs(it.y - curY) > 3) {
            if (cur !== null) lines.push(cur.replace(/\s+/g, " ").trim());
            cur = it.str; curY = it.y; prev = it;
          } else {
            var gap = it.x - (prev.x + prev.w);
            cur += (gap > 1 ? " " : "") + it.str;
            prev = it;
          }
        });
        if (cur !== null) lines.push(cur.replace(/\s+/g, " ").trim());
      });
      return lines;
    });
  }

  // Parse reconstructed lines into { rows, intro, repeats }.
  function parsePattern(lines) {
    var rows = [];
    var intro = "";
    var repeats = 0;
    var rowRe = /^Row\s+(\d+)\s*[—–\-:]\s*(.+)$/i;
    var continues = /^[a-z(]/; // stitch instructions start lowercase or "("
    var lastIsRow = false;

    lines.forEach(function (line) {
      var m = line.match(rowRe);
      if (m) {
        rows.push(m[2].trim());
        lastIsRow = true;
        return;
      }
      if (lastIsRow && continues.test(line) && line.indexOf("Copyright") === -1) {
        // Wrapped continuation of the previous row.
        rows[rows.length - 1] += " " + line.trim();
        return;
      }
      lastIsRow = false;
      if (!intro) {
        var cast = line.match(/cast on[^.]*\.?/i);
        if (cast) intro = cast[0].trim();
      }
      var rep = line.match(/repeat[^.]*?(\d+)\s*times/i);
      if (rep) repeats = parseInt(rep[1], 10);
    });

    return { rows: rows, intro: intro, repeats: repeats };
  }

  /* ============================================================
   * Wiring
   * ========================================================== */
  document.getElementById("importBtn").addEventListener("click", function () {
    document.getElementById("pdfInput").click();
  });
  document.getElementById("pdfInput").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) importPdf(file);
    e.target.value = ""; // allow re-importing the same file
  });
  document.getElementById("manualBtn").addEventListener("click", openManual);

  document.getElementById("backToLibrary").addEventListener("click", showLibrary);
  document.getElementById("knitModeBtn").addEventListener("click", openKnit);

  repeatPrevEl.addEventListener("click", function () { changeRepeat(-1); });
  repeatNextEl.addEventListener("click", function () { changeRepeat(1); });

  document.getElementById("resetRepeat").addEventListener("click", function () {
    var proj = activeProject();
    if (confirm("Clear progress for repeat " + proj.currentRepeat + "?")) {
      setCursor(proj, 0);
      refreshTracker();
    }
  });
  document.getElementById("deleteProject").addEventListener("click", function () {
    var proj = activeProject();
    if (confirm("Delete “" + proj.name + "” and its progress? This can’t be undone.")) {
      store.projects = store.projects.filter(function (p) { return p.id !== proj.id; });
      store.activeId = store.projects.length ? store.projects[0].id : null;
      save();
      showLibrary();
    }
  });

  document.getElementById("knitAdvance").addEventListener("click", knitAdvance);
  document.getElementById("knitBack").addEventListener("click", function (e) { e.stopPropagation(); knitReverse(); });
  document.getElementById("knitExit").addEventListener("click", function (e) { e.stopPropagation(); closeKnit(); });

  document.getElementById("modalCancel").addEventListener("click", closeModal);
  document.getElementById("modalSave").addEventListener("click", saveFromModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  // Start on the library.
  showLibrary();
})();
