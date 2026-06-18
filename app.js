(function () {
  "use strict";

  // --- Pattern data: Daphne lace scarf -------------------------------------
  // Each row is the comma-separated list of stitch groups exactly as written
  // in the pattern. Cast on 30 stitches, repeat these 24 rows 12 times.
  var ROW_STRINGS = [
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

  var TOTAL_REPEATS = 12;

  // Parse rows into arrays of group strings. We split on commas but keep
  // parenthesised groups like "(k1, yo) twice" intact as a single group.
  var ROWS = ROW_STRINGS.map(function (s) {
    var groups = [];
    var depth = 0, current = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        groups.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) groups.push(current.trim());
    return groups;
  });

  // --- State / persistence -------------------------------------------------
  var STORAGE_KEY = "daphne-stitch-tracker-v1";

  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.progress) return parsed;
      }
    } catch (e) { /* ignore */ }
    return { currentRepeat: 1, progress: {} };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* storage unavailable; app still works for the session */ }
  }

  // Returns the boolean array of done-flags for a row in the current repeat,
  // creating it lazily.
  function getRowProgress(rowIdx) {
    var rep = state.currentRepeat;
    if (!state.progress[rep]) state.progress[rep] = {};
    if (!state.progress[rep][rowIdx]) {
      state.progress[rep][rowIdx] = ROWS[rowIdx].map(function () { return false; });
    }
    return state.progress[rep][rowIdx];
  }

  // --- Rendering -----------------------------------------------------------
  var rowsEl = document.getElementById("rows");
  var repeatNumEl = document.getElementById("repeatNum");
  var repeatPrevEl = document.getElementById("repeatPrev");
  var repeatNextEl = document.getElementById("repeatNext");
  var progressFillEl = document.getElementById("progressFill");
  var progressTextEl = document.getElementById("progressText");

  function rowIsComplete(rowIdx) {
    return getRowProgress(rowIdx).every(function (d) { return d; });
  }

  // The active row is the first not-yet-complete row.
  function activeRowIndex() {
    for (var i = 0; i < ROWS.length; i++) {
      if (!rowIsComplete(i)) return i;
    }
    return ROWS.length; // all complete
  }

  function buildRows() {
    rowsEl.innerHTML = "";
    ROWS.forEach(function (groups, rowIdx) {
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
        var chip = document.createElement("button");
        chip.className = "chip";
        chip.dataset.row = rowIdx;
        chip.dataset.group = groupIdx;
        chip.setAttribute("aria-pressed", "false");

        var index = document.createElement("span");
        index.className = "chip-index";
        index.textContent = "S" + (groupIdx + 1);
        chip.appendChild(index);

        var label = document.createElement("span");
        label.className = "chip-text";
        label.textContent = text;
        chip.appendChild(label);

        chip.addEventListener("click", function () {
          toggleChip(rowIdx, groupIdx);
        });

        groupsEl.appendChild(chip);
      });

      card.appendChild(groupsEl);
      rowsEl.appendChild(card);
    });
  }

  function refresh() {
    repeatNumEl.textContent = state.currentRepeat;
    repeatPrevEl.disabled = state.currentRepeat <= 1;
    repeatNextEl.disabled = state.currentRepeat >= TOTAL_REPEATS;

    var active = activeRowIndex();
    var totalGroups = 0, doneGroups = 0;

    var cards = rowsEl.querySelectorAll(".row-card");
    cards.forEach(function (card) {
      var rowIdx = +card.dataset.row;
      var prog = getRowProgress(rowIdx);
      var complete = prog.every(function (d) { return d; });
      var doneInRow = prog.filter(function (d) { return d; }).length;

      totalGroups += prog.length;
      doneGroups += doneInRow;

      card.classList.toggle("complete", complete);
      card.classList.toggle("active", rowIdx === active);

      var badge = card.querySelector(".row-badge");
      badge.style.display = complete ? "" : "none";

      card.querySelector(".row-count").textContent = doneInRow + "/" + prog.length;

      // The "next" chip = first undone chip in the active row only.
      var chips = card.querySelectorAll(".chip");
      var nextGroup = -1;
      if (rowIdx === active) {
        for (var i = 0; i < prog.length; i++) {
          if (!prog[i]) { nextGroup = i; break; }
        }
      }
      chips.forEach(function (chip) {
        var g = +chip.dataset.group;
        var done = prog[g];
        chip.classList.toggle("done", done);
        chip.classList.toggle("next", g === nextGroup);
        chip.setAttribute("aria-pressed", done ? "true" : "false");
      });
    });

    var pct = totalGroups ? Math.round((doneGroups / totalGroups) * 100) : 0;
    progressFillEl.style.width = pct + "%";
    var rowLabel = active >= ROWS.length ? "Repeat complete 🎉" : "Row " + (active + 1);
    progressTextEl.textContent = rowLabel + " · " + pct + "%";
  }

  function toggleChip(rowIdx, groupIdx) {
    var prog = getRowProgress(rowIdx);
    prog[groupIdx] = !prog[groupIdx];
    saveState();
    refresh();
  }

  function goToRepeat(rep) {
    if (rep < 1 || rep > TOTAL_REPEATS) return;
    state.currentRepeat = rep;
    saveState();
    refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Wiring --------------------------------------------------------------
  repeatPrevEl.addEventListener("click", function () { goToRepeat(state.currentRepeat - 1); });
  repeatNextEl.addEventListener("click", function () { goToRepeat(state.currentRepeat + 1); });

  document.getElementById("resetRepeat").addEventListener("click", function () {
    if (confirm("Clear all marks for repeat " + state.currentRepeat + "?")) {
      state.progress[state.currentRepeat] = {};
      saveState();
      refresh();
    }
  });

  document.getElementById("resetAll").addEventListener("click", function () {
    if (confirm("Reset all progress for every repeat? This cannot be undone.")) {
      state = { currentRepeat: 1, progress: {} };
      saveState();
      refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  buildRows();
  refresh();
})();
