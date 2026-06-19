(function () {
  "use strict";

  /* ============================================================
   * Standard stitch lexicon (abbreviation -> plain definition)
   *
   * These are STANDARD, non-copyrightable knitting abbreviations
   * (the kind published in the Craft Yarn Council master list and
   * common glossaries). No pattern-specific text is included here.
   * Synonyms map to the same definition; "(= yo)" etc. notes the
   * common equivalents.
   * ========================================================== */
  var LEX = {
    "k": "Knit.",
    "p": "Purl.",
    "st": "Stitch.",
    "sts": "Stitches.",
    "co": "Cast on.",
    "bo": "Bind off (cast off).",
    "rs": "Right side.",
    "ws": "Wrong side.",
    "tog": "Together.",
    "tbl": "Through the back loop.",
    "ktbl": "Knit through the back loop (twisted).",
    "ptbl": "Purl through the back loop.",
    "yo": "Yarn over.",
    "yf": "Yarn forward (= yarn over).",
    "yfwd": "Yarn forward (= yarn over).",
    "yon": "Yarn over needle (= yarn over).",
    "yrn": "Yarn round needle (= yarn over).",
    "k2tog": "Knit two stitches together (right-leaning decrease).",
    "k3tog": "Knit three stitches together.",
    "p2tog": "Purl two stitches together.",
    "p3tog": "Purl three stitches together.",
    "ssk": "Slip, slip, knit: slip two stitches knitwise, then knit them together through the back loops (left-leaning decrease).",
    "ssp": "Slip, slip, purl the two slipped stitches together through the back loops.",
    "sssk": "Slip, slip, slip, then knit the three slipped stitches together (double decrease).",
    "sl": "Slip a stitch (purlwise unless stated).",
    "sl1": "Slip one stitch.",
    "psso": "Pass the slipped stitch over.",
    "p2sso": "Pass the two slipped stitches over.",
    "skp": "Slip 1, knit 1, pass the slipped stitch over (left-leaning decrease).",
    "sk2p": "Slip 1, knit 2 together, pass the slipped stitch over (double decrease).",
    "s2kp": "Slip 2 together, knit 1, pass the two slipped stitches over (centered double decrease).",
    "cdd": "Centered double decrease.",
    "m1": "Make one stitch (increase).",
    "m1l": "Make one left-leaning increase.",
    "m1r": "Make one right-leaning increase.",
    "m1p": "Make one purlwise.",
    "kfb": "Knit into the front and back of the stitch (increase).",
    "pfb": "Purl into the front and back of the stitch (increase).",
    "inc": "Increase.",
    "dec": "Decrease.",
    "rep": "Repeat.",
    "patt": "Pattern.",
    "pat": "Pattern.",
    "beg": "Beginning.",
    "cont": "Continue.",
    "rem": "Remaining.",
    "pm": "Place marker.",
    "sm": "Slip marker.",
    "rm": "Remove marker.",
    "wyib": "With yarn in back.",
    "wyif": "With yarn in front.",
    "kwise": "Knitwise.",
    "pwise": "Purlwise.",
    "w&t": "Wrap and turn (short rows).",
    "cn": "Cable needle.",
    "c4f": "Cable 4 front: hold 2 stitches on cable needle in front, knit 2, then knit 2 from cable needle.",
    "c4b": "Cable 4 back: hold 2 stitches on cable needle in back, knit 2, then knit 2 from cable needle.",
    "c6f": "Cable 6 front.",
    "c6b": "Cable 6 back.",
    "lc": "Left cross (cable).",
    "rc": "Right cross (cable).",
    "rnd": "Round.",
    "rnds": "Rounds.",
    "mc": "Main color.",
    "cc": "Contrast color."
  };

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
   * Parsing primitives
   * ========================================================== */

  // Split a row body into stitch groups on top-level commas, keeping
  // bracketed groups — both "( … )" and "[ … ]" — intact.
  function splitGroups(s) {
    var groups = [], depth = 0, star = false, cur = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === "(" || ch === "[") depth++;
      else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
      else if (ch === "*") star = !star; // protect *…* repeat sections
      if (ch === "," && depth === 0 && !star) { groups.push(cur); cur = ""; }
      else cur += ch;
    }
    if (cur.trim()) groups.push(cur);
    return groups
      .map(function (g) { return g.replace(/^[\s,;]+|[\s,;.]+$/g, "").trim(); })
      .filter(function (g) { return g.length > 0; });
  }

  // Header for a row/round line. Captures keyword, start number, an
  // optional qualifier (e.g. " (RS)", " and all following WS rows until
  // row 34", "-3"), then ":" or a spaced dash, then the body.
  var HEADER_RE = /^(rows?|rounds?|rnds?)\s+(\d+)([^:]*?)(?::|\s[–—-]\s)\s*(.+)$/i;

  // Turn a body string into a row record, stripping a trailing stitch
  // count annotation like "(3 sts)" or "(55(63,71,…) sts)".
  function buildRow(label, side, body) {
    var count = null;
    body = body.replace(
      /\(((?:[^()]|\([^()]*\))*?)\s*sts?\.?\s*\)\s*\.?\s*$/i,
      function (_, c) { count = (c || "").trim(); return " "; }
    );
    body = body.trim().replace(/[.;]+$/, "").trim();
    return { label: label, side: side || null, count: count, groups: splitGroups(body) };
  }

  // Expand one logical line into one or more row records, applying
  // range expansion ("Row 6 and all following WS rows until row 34"
  // -> rows 6, 8, … 34). ctx.auto numbers header-less manual lines.
  function expandHeaderToRows(line, ctx) {
    line = (line || "").trim();
    if (!line) return [];
    var m = line.match(HEADER_RE);
    if (!m) {
      var r = buildRow("Row " + (ctx.auto++), null, line);
      return r.groups.length ? [r] : [];
    }
    var startNum = parseInt(m[2], 10);
    var qualifier = m[3] || "";
    var body = m[4] || "";

    var sideM = qualifier.match(/\b(RS|WS)\b/i) || body.match(/^\s*\((RS|WS)\)/i);
    var side = sideM ? sideM[1].toUpperCase() : null;
    body = body.replace(/^\s*\((?:RS|WS)\)\s*/i, "").trim();

    var end = startNum, step = 1;
    var untilM = qualifier.match(/until\s+(?:row\s+)?(\d+)/i);
    var dashM = qualifier.match(/^\s*[-–—]\s*(\d+)/);
    if (untilM) {
      end = parseInt(untilM[1], 10);
      if (/\b(?:WS|RS)\b|every other|alternate|following/i.test(qualifier)) step = 2;
    } else if (dashM) {
      end = parseInt(dashM[1], 10);
    }
    if (end < startNum) end = startNum;

    var rows = [];
    for (var n = startNum; n <= end && (n - startNum) <= 600; n += (step || 1)) {
      var row = buildRow("Row " + n, side, body);
      if (row.groups.length) rows.push(row);
    }
    return rows;
  }

  // De-duplicate by row number (last definition wins, so a later
  // "Rows 34 …" override beats an earlier range), then sort by number.
  function dedupSortRows(rows) {
    var map = {}, order = [], synth = 0;
    rows.forEach(function (r) {
      var nm = (r.label || "").match(/(\d+)/);
      var key = nm ? "n" + parseInt(nm[1], 10) : "s" + (synth++);
      if (!(key in map)) order.push(key);
      map[key] = r;
    });
    var out = order.map(function (k) { return map[k]; });
    out.sort(function (a, b) {
      var na = (a.label.match(/\d+/) || [1e9])[0];
      var nb = (b.label.match(/\d+/) || [1e9])[0];
      return parseInt(na, 10) - parseInt(nb, 10);
    });
    return out;
  }

  // Tokenise a group into candidate abbreviation tokens.
  function tokenize(g) {
    return (g || "").split(/[^A-Za-z0-9\/&]+/).filter(Boolean);
  }

  // Build a glossary: PDF-extracted definitions first (the user's own
  // file, kept on-device), then standard lexicon entries for any
  // abbreviation actually used that isn't already covered.
  function buildGlossary(rows, pdfGloss) {
    var seen = {}, out = [];
    (pdfGloss || []).forEach(function (pair) {
      var key = String(pair[0]).toLowerCase().trim();
      if (key && !seen[key]) { seen[key] = 1; out.push([pair[0].trim(), pair[1].trim()]); }
    });
    rows.forEach(function (r) {
      r.groups.forEach(function (g) {
        tokenize(g).forEach(function (tok) {
          var lc = tok.toLowerCase();
          var base = lc.replace(/\d+$/, "");
          var def = LEX[lc] || LEX[base];
          if (def && !seen[lc]) { seen[lc] = 1; out.push([tok, def]); }
        });
      });
    });
    return out;
  }

  // Parse a list of reconstructed PDF text lines into a pattern.
  function parsePattern(lines) {
    var logical = [];
    var intro = null, repeats = 0, glossary = [], notes = [];
    var curRow = null, curGloss = null;

    var STOP_RE = /^(now\b|when\b|repeat rows|repeat from|cast on|co\b|bind off|bo\b|cut yarn|remember|see how|work like this|page\s*\d|key to|general abbreviations|written pattern|all slipped|the video|for size|©|copyright)/i;
    var GLOSS_RE = /^([A-Za-z0-9][A-Za-z0-9 \/–\-]{0,30}?)\s*[:=]\s*(.+)$/;

    function flushRow() { if (curRow != null) { logical.push(curRow.trim()); curRow = null; } }
    function flushGloss() { if (curGloss) { glossary.push([curGloss[0].trim(), curGloss[1].trim()]); curGloss = null; } }

    lines.forEach(function (raw) {
      var line = (raw || "").trim();
      if (!line) return;

      // Page footers / copyright banners: never part of a row or glossary.
      if (/©|copyright/i.test(line)) { flushRow(); flushGloss(); return; }

      if (HEADER_RE.test(line)) { flushRow(); flushGloss(); curRow = line; return; }

      if (STOP_RE.test(line)) {
        flushRow(); flushGloss();
        if (intro == null && /^cast on/i.test(line)) intro = line.replace(/\s+/g, " ").trim();
        if (/^(now|repeat rows|work rows)/i.test(line)) notes.push(line.replace(/\s+/g, " ").trim());
        return;
      }

      if (curRow != null) { curRow += " " + line; return; } // wrapped row

      var gm = line.match(GLOSS_RE);
      if (gm) { flushGloss(); curGloss = [gm[1], gm[2]]; return; }
      if (curGloss) { curGloss[1] += " " + line; return; }   // wrapped definition

      if (intro == null && /^cast on/i.test(line)) intro = line.replace(/\s+/g, " ").trim();
    });
    flushRow(); flushGloss();

    var ctx = { auto: 1 }, rows = [];
    logical.forEach(function (l) { expandHeaderToRows(l, ctx).forEach(function (r) { rows.push(r); }); });
    rows = dedupSortRows(rows);

    return { rows: rows, intro: intro, repeats: repeats, glossary: glossary, notes: notes };
  }

  function serializeRow(r) {
    return r.label + (r.side ? " (" + r.side + ")" : "") + ": " +
      r.groups.join(", ") + (r.count ? " (" + r.count + " sts)" : "");
  }

  // Expose pure helpers for testing.
  window.KnitParser = {
    splitGroups: splitGroups, buildRow: buildRow, expandHeaderToRows: expandHeaderToRows,
    dedupSortRows: dedupSortRows, parsePattern: parsePattern, buildGlossary: buildGlossary,
    serializeRow: serializeRow, LEX: LEX
  };

  /* ============================================================
   * Project model helpers
   * ========================================================== */
  function newId() { return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function rowsFromStrings(strings) {
    return strings.map(function (s, i) {
      return { label: "Row " + (i + 1), side: null, count: null, groups: splitGroups(s) };
    });
  }

  function makeProject(name, intro, repeats, rowObjs, glossary) {
    return {
      id: newId(),
      name: name || "Untitled pattern",
      intro: intro || "",
      repeats: Math.max(1, repeats | 0) || 1,
      rows: rowObjs,
      glossary: glossary || [],
      currentRepeat: 1,
      cursors: {}
    };
  }

  // Coerce any stored project (including older array-of-strings rows)
  // into the current row-object shape. Cursors stay valid because group
  // counts are unchanged.
  function normalizeProject(p) {
    p.rows = (p.rows || []).map(function (r, i) {
      if (Array.isArray(r)) return { label: "Row " + (i + 1), side: null, count: null, groups: r };
      return {
        label: r.label || ("Row " + (i + 1)),
        side: r.side != null ? r.side : null,
        count: r.count != null ? r.count : null,
        groups: r.groups || []
      };
    });
    if (!p.cursors) p.cursors = {};
    if (!p.currentRepeat) p.currentRepeat = 1;
    if (!p.glossary) p.glossary = [];
    if (!p.repeats) p.repeats = 1;
    return p;
  }

  function flatten(proj) {
    var f = [];
    proj.rows.forEach(function (row, ri) {
      row.groups.forEach(function (text, gi) { f.push({ ri: ri, gi: gi, text: text }); });
    });
    return f;
  }
  function totalSteps(proj) {
    return proj.rows.reduce(function (sum, r) { return sum + r.groups.length; }, 0);
  }
  function getCursor(proj) { return proj.cursors[proj.currentRepeat] || 0; }
  function setCursor(proj, c) {
    proj.cursors[proj.currentRepeat] = Math.max(0, Math.min(c, totalSteps(proj)));
    save();
  }
  function rowLabel(row) { return row.label + (row.side ? " (" + row.side + ")" : ""); }

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
        if (parsed && Array.isArray(parsed.projects)) {
          parsed.projects.forEach(normalizeProject);
          return parsed;
        }
      }
    } catch (e) { /* fall through to fresh/migrated store */ }

    var s = { projects: [], activeId: null };
    var daphne = makeProject("Daphne", "Cast on 30 stitches. Bind off and weave in ends when done.",
      12, rowsFromStrings(DAPHNE_ROWS), DAPHNE_GLOSSARY);

    try {
      var oldRaw = localStorage.getItem(OLD_KEY);
      if (oldRaw) {
        var old = JSON.parse(oldRaw);
        if (old && old.progress) {
          daphne.currentRepeat = old.currentRepeat || 1;
          var max = totalSteps(daphne);
          Object.keys(old.progress).forEach(function (rep) {
            var rowsMap = old.progress[rep] || {}, done = 0;
            Object.keys(rowsMap).forEach(function (ri) {
              var arr = rowsMap[ri] || [];
              for (var i = 0; i < arr.length; i++) if (arr[i]) done++;
            });
            daphne.cursors[rep] = Math.min(done, max);
          });
        }
      }
    } catch (e) { /* ignore malformed old data */ }

    s.projects.push(daphne);
    s.activeId = daphne.id;
    return s;
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* ignore */ } }
  function activeProject() {
    return store.projects.filter(function (p) { return p.id === store.activeId; })[0] || null;
  }
  function removeProject(id) {
    store.projects = store.projects.filter(function (p) { return p.id !== id; });
    if (store.activeId === id) store.activeId = store.projects.length ? store.projects[0].id : null;
    save();
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
      var max = totalSteps(proj), doneOverall = 0;
      for (var r = 1; r <= proj.repeats; r++) doneOverall += Math.min(proj.cursors[r] || 0, max);
      var pct = max && proj.repeats ? Math.round((doneOverall / (max * proj.repeats)) * 100) : 0;

      var card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML =
        '<div class="pc-main"><h3></h3><div class="pc-meta"></div>' +
        '<div class="pc-bar"><div class="pc-fill"></div></div></div>' +
        '<button class="pc-del" aria-label="Delete project">🗑</button><div class="pc-go">›</div>';
      card.querySelector("h3").textContent = proj.name;
      card.querySelector(".pc-meta").textContent =
        proj.rows.length + " rows · " + proj.repeats + " repeat" + (proj.repeats === 1 ? "" : "s") + " · " + pct + "% done";
      card.querySelector(".pc-fill").style.width = pct + "%";
      card.addEventListener("click", function () { openProject(proj.id); });

      var del = card.querySelector(".pc-del");
      del.setAttribute("aria-label", "Delete " + proj.name);
      del.addEventListener("click", function (e) {
        e.stopPropagation();
        if (confirm("Delete “" + proj.name + "” and its progress? This can’t be undone.")) {
          removeProject(proj.id);
          renderLibrary();
        }
      });
      listEl.appendChild(card);
    });
  }

  /* ============================================================
   * Tracker rendering
   * ========================================================== */
  var rowsEl = document.getElementById("rows");
  var repeatNumEl = document.getElementById("repeatNum");
  var repeatPrevEl = document.getElementById("repeatPrev");
  var repeatNextEl = document.getElementById("repeatNext");
  var progressFillEl = document.getElementById("progressFill");
  var progressTextEl = document.getElementById("progressText");

  function buildTracker() {
    var proj = activeProject();
    if (!proj) { showLibrary(); return; }

    document.getElementById("projTitle").textContent = proj.name;
    document.getElementById("projSubtitle").textContent = proj.rows.length + " rows · repeat " + proj.repeats + "×";
    document.getElementById("repeatTotal").textContent = proj.repeats;
    document.getElementById("introText").textContent =
      proj.intro || ("Work the " + proj.rows.length + " rows, then repeat " + proj.repeats + " times.");

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
    } else { box.hidden = true; }

    rowsEl.innerHTML = "";
    var flatIndex = 0;
    proj.rows.forEach(function (row, rowIdx) {
      var card = document.createElement("section");
      card.className = "row-card";
      card.dataset.row = rowIdx;

      var head = document.createElement("div");
      head.className = "row-head";
      var num = document.createElement("span");
      num.className = "row-number";
      num.textContent = rowLabel(row);
      head.appendChild(num);
      if (row.count) {
        var note = document.createElement("span");
        note.className = "row-note";
        note.textContent = row.count + " sts";
        head.appendChild(note);
      }
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
      row.groups.forEach(function (text, groupIdx) {
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
    if (flatIndex < c) setCursor(proj, flatIndex);
    else setCursor(proj, flatIndex + 1);
    refreshTracker();
  }

  function refreshTracker() {
    var proj = activeProject();
    if (!proj) return;
    var cursor = getCursor(proj), max = totalSteps(proj);

    repeatNumEl.textContent = proj.currentRepeat;
    repeatPrevEl.disabled = proj.currentRepeat <= 1;
    repeatNextEl.disabled = proj.currentRepeat >= proj.repeats;

    var activeRow = proj.rows.length, acc = 0;
    for (var i = 0; i < proj.rows.length; i++) {
      var len = proj.rows[i].groups.length;
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
   * Knitting mode
   * ========================================================== */
  var knitEl = document.getElementById("knitMode");
  function openKnit() { knitEl.hidden = false; refreshKnit(); }
  function closeKnit() { knitEl.hidden = true; }

  function refreshKnit() {
    var proj = activeProject();
    if (!proj) return;
    var flat = flatten(proj), cursor = getCursor(proj), max = flat.length;

    var metaEl = document.getElementById("knitMeta");
    var rowLabelEl = document.getElementById("knitRowLabel");
    var groupEl = document.getElementById("knitGroup");
    var stepEl = document.getElementById("knitStep");
    var ctxEl = document.getElementById("knitRowContext");
    var nextEl = document.getElementById("knitNext");

    groupEl.classList.remove("complete");
    nextEl.innerHTML = ""; ctxEl.innerHTML = "";

    if (cursor >= max) {
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
          proj.currentRepeat += 1; save(); refreshTracker(); refreshKnit();
        });
        nextEl.appendChild(btn);
      } else { groupEl.textContent = "Pattern complete 🎉"; }
      return;
    }

    var step = flat[cursor], row = proj.rows[step.ri];
    metaEl.textContent =
      "Repeat " + proj.currentRepeat + " / " + proj.repeats + " · " + rowLabel(row);
    rowLabelEl.textContent = rowLabel(row) + " — S" + (step.gi + 1);
    groupEl.textContent = step.text;
    stepEl.textContent = "step " + (cursor + 1) + " of " + max;

    var rowStart = cursor - step.gi;
    row.groups.forEach(function (text, gi) {
      var span = document.createElement("span");
      span.className = "kc";
      var fi = rowStart + gi;
      if (fi < cursor) span.classList.add("done");
      if (gi === step.gi) span.classList.add("current");
      span.textContent = text;
      ctxEl.appendChild(span);
    });

    if (cursor + 1 < max) {
      var n = flat[cursor + 1];
      nextEl.textContent = "Next: " + (n.ri === step.ri ? n.text : rowLabel(proj.rows[n.ri]) + ": " + n.text);
    } else { nextEl.textContent = "Last step of this repeat"; }
  }

  function knitAdvance() {
    var proj = activeProject();
    if (getCursor(proj) >= totalSteps(proj)) return;
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
  var pendingGlossary = null;

  function openModal(title) { document.getElementById("modalTitle").textContent = title; modal.hidden = false; }
  function closeModal() { modal.hidden = true; statusEl.textContent = ""; statusEl.className = "modal-status"; }
  function setStatus(msg, kind) { statusEl.textContent = msg; statusEl.className = "modal-status" + (kind ? " " + kind : ""); }

  function openManual() {
    pendingGlossary = null;
    fName.value = ""; fIntro.value = ""; fRepeats.value = "1"; fRows.value = "";
    setStatus("Paste your rows below, one per line.", "");
    openModal("Add pattern");
  }

  function saveFromModal() {
    var name = fName.value.trim();
    var ctx = { auto: 1 }, rows = [];
    fRows.value.split(/\r?\n/).forEach(function (line) {
      expandHeaderToRows(line, ctx).forEach(function (r) { rows.push(r); });
    });
    rows = dedupSortRows(rows);
    if (!rows.length) {
      setStatus("No rows found. Add at least one line like “Row 1 — k2, p2”.", "error");
      return;
    }
    var glossary = buildGlossary(rows, pendingGlossary);
    var proj = makeProject(name, fIntro.value.trim(), parseInt(fRepeats.value, 10) || 1, rows, glossary);
    store.projects.push(proj);
    save();
    pendingGlossary = null;
    closeModal();
    openProject(proj.id);
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
    pendingGlossary = null;
    openModal("Import “" + defaultName + "”");
    fName.value = defaultName; fIntro.value = ""; fRepeats.value = "1"; fRows.value = "";
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
          fRows.value = parsed.rows.map(serializeRow).join("\n");
          var introBits = [parsed.intro].concat(parsed.notes).filter(Boolean);
          if (introBits.length) fIntro.value = introBits.join("\n");
          fRepeats.value = parsed.repeats || 1;
          pendingGlossary = parsed.glossary;
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
          .map(function (it) { return { str: it.str, x: it.transform[4], y: it.transform[5], w: it.width || 0 }; });
        items.sort(function (a, b) { return Math.abs(a.y - b.y) > 3 ? b.y - a.y : a.x - b.x; });
        var cur = null, curY = null, prev = null;
        items.forEach(function (it) {
          if (curY === null || Math.abs(it.y - curY) > 3) {
            if (cur !== null) lines.push(cur.replace(/\s+/g, " ").trim());
            cur = it.str; curY = it.y; prev = it;
          } else {
            var gap = it.x - (prev.x + prev.w);
            cur += (gap > 1 ? " " : "") + it.str; prev = it;
          }
        });
        if (cur !== null) lines.push(cur.replace(/\s+/g, " ").trim());
      });
      return lines;
    });
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
    e.target.value = "";
  });
  document.getElementById("manualBtn").addEventListener("click", openManual);

  document.getElementById("backToLibrary").addEventListener("click", showLibrary);
  document.getElementById("knitModeBtn").addEventListener("click", openKnit);

  repeatPrevEl.addEventListener("click", function () { changeRepeat(-1); });
  repeatNextEl.addEventListener("click", function () { changeRepeat(1); });

  document.getElementById("resetRepeat").addEventListener("click", function () {
    var proj = activeProject();
    if (confirm("Clear progress for repeat " + proj.currentRepeat + "?")) { setCursor(proj, 0); refreshTracker(); }
  });
  document.getElementById("deleteProject").addEventListener("click", function () {
    var proj = activeProject();
    if (confirm("Delete “" + proj.name + "” and its progress? This can’t be undone.")) {
      removeProject(proj.id);
      showLibrary();
    }
  });

  document.getElementById("knitAdvance").addEventListener("click", knitAdvance);
  document.getElementById("knitBack").addEventListener("click", function (e) { e.stopPropagation(); knitReverse(); });
  document.getElementById("knitExit").addEventListener("click", function (e) { e.stopPropagation(); closeKnit(); });

  document.getElementById("modalCancel").addEventListener("click", closeModal);
  document.getElementById("modalSave").addEventListener("click", saveFromModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  showLibrary();
})();
