(function (global) {
  "use strict";

  var EXCLUDED_TAGS = new Set(["ASIDE", "SCRIPT", "TEMPLATE"]);
  var HEADING_TAGS = new Set(["H1", "H2", "H3", "H4"]);

  function normalizeLayoutName(name) {
    if (!name) {
      return null;
    }

    var value = String(name).trim().toLowerCase();
    if (value === "centered" || value === "centered-statement") {
      return "statement";
    }
    if (value === "code" || value === "code-focus") {
      return "code-focus";
    }
    if (value === "image" || value === "image-caption") {
      return "image-caption";
    }
    if (value === "steps" || value === "step") {
      return "step";
    }
    return value;
  }

  function parseLayoutHint(value) {
    if (!value) {
      return null;
    }

    var normalized = String(value).trim().toLowerCase();
    var parts = normalized.split(":").filter(Boolean);
    if (parts.length === 0) {
      return null;
    }

    var primitive = normalizeLayoutName(parts[0]);
    if (primitive !== "split") {
      return {
        primitive: primitive,
        orientation: "horizontal",
        paneModes: null,
        raw: normalized
      };
    }

    var variant = parts[1] || "text-text";
    var orientation = parts[2] === "vertical" ? "vertical" : "horizontal";
    var paneModes = variant.split("-");
    if (paneModes.length !== 2) {
      paneModes = ["text", "text"];
    }

    paneModes = paneModes.map(function (mode) {
      return mode === "image" ? "image" : "text";
    });

    return {
      primitive: "split",
      orientation: orientation,
      paneModes: paneModes,
      raw: normalized
    };
  }

  function parseCommentHints(section) {
    var hints = {};
    var walker = document.createTreeWalker(section, NodeFilter.SHOW_COMMENT);
    var current = walker.nextNode();

    while (current) {
      var match = current.nodeValue.match(/^\s*([a-z-]+)\s*:\s*(.+?)\s*$/i);
      if (match) {
        hints[match[1].toLowerCase()] = match[2].trim();
      }
      current = walker.nextNode();
    }

    return hints;
  }

  function isIgnoredElement(node) {
    return node.nodeType !== Node.ELEMENT_NODE || EXCLUDED_TAGS.has(node.tagName);
  }

  function topLevelElements(section) {
    return Array.from(section.children).filter(function (node) {
      return !node.classList.contains("dz-split-shell") && !isIgnoredElement(node);
    });
  }

  function contentElements(section) {
    return topLevelElements(section).filter(function (node) {
      return !node.matches("[data-dz-generated]");
    });
  }

  function inferLayout(section) {
    var elements = contentElements(section);
    if (elements.length === 0) {
      return null;
    }

    var hasFragments = section.querySelector(".fragment") !== null;
    var hasCode = section.querySelector("pre, code") !== null;
    var images = Array.from(section.querySelectorAll("img, video, iframe")).filter(function (node) {
      return node.closest("aside.notes") === null;
    });
    var listCount = section.querySelectorAll("ul, ol").length;
    var paragraphCount = section.querySelectorAll("p").length;
    var headingElements = elements.filter(function (node) {
      return HEADING_TAGS.has(node.tagName);
    });

    if (hasFragments) {
      return parseLayoutHint("step");
    }

    if (hasCode) {
      return parseLayoutHint("code-focus");
    }

    if (images.length > 0) {
      if (elements.length <= 2 || (images.length === 1 && paragraphCount <= 1 && listCount === 0)) {
        return parseLayoutHint("image-caption");
      }
    }

    if (headingElements.length === 1 && elements[0].tagName === "H1" && elements.length <= 3) {
      return parseLayoutHint("title");
    }

    if (headingElements.length >= 1 && paragraphCount === 1 && listCount === 0 && images.length === 0 && elements.length <= 2) {
      return parseLayoutHint("statement");
    }

    var splitCandidate = getSplitCandidates(section);
    if (splitCandidate) {
      return parseLayoutHint("split:text-text");
    }

    return null;
  }

  function getSplitCandidates(section) {
    var elements = contentElements(section);
    if (elements.length < 2) {
      return null;
    }

    var candidates = elements.slice();
    var headerCount = 0;

    while (candidates.length > 2 && headerCount < elements.length) {
      if (!HEADING_TAGS.has(candidates[0].tagName) && candidates[0].tagName !== "P") {
        break;
      }
      candidates.shift();
      headerCount += 1;
    }

    if (candidates.length !== 2) {
      return null;
    }

    return {
      headerNodes: elements.slice(0, headerCount),
      paneNodes: candidates
    };
  }

  function clearGenerated(section) {
    Array.from(section.querySelectorAll(".dz-split-shell[data-dz-generated='true']")).forEach(function (shell) {
      var header = shell.querySelector(".dz-split-header[data-dz-generated='true']");
      if (header) {
        while (header.firstChild) {
          section.insertBefore(header.firstChild, shell);
        }
      }

      var panes = Array.from(shell.querySelectorAll(".dz-pane[data-dz-generated='true']"));
      panes.forEach(function (pane) {
        while (pane.firstChild) {
          section.insertBefore(pane.firstChild, shell);
        }
      });

      shell.remove();
    });
  }

  function ensureSplitStructure(section, layout) {
    var splitCandidate = getSplitCandidates(section);
    if (!splitCandidate) {
      return;
    }

    var shell = document.createElement("div");
    shell.className = "dz-split-shell";
    shell.setAttribute("data-dz-generated", "true");

    if (splitCandidate.headerNodes.length > 0) {
      var header = document.createElement("div");
      header.className = "dz-split-header";
      header.setAttribute("data-dz-generated", "true");
      splitCandidate.headerNodes.forEach(function (node) {
        header.appendChild(node);
      });
      shell.appendChild(header);
    }

    var grid = document.createElement("div");
    grid.className = "dz-split-grid";
    grid.dataset.dzOrientation = layout.orientation;
    grid.setAttribute("data-dz-generated", "true");

    splitCandidate.paneNodes.forEach(function (node, index) {
      var pane = document.createElement("div");
      pane.className = "dz-pane";
      pane.dataset.dzPaneMode = layout.paneModes[index] || "text";
      pane.setAttribute("data-dz-generated", "true");
      pane.appendChild(node);
      grid.appendChild(pane);
    });

    shell.appendChild(grid);
    section.appendChild(shell);
  }

  function apply(sectionOrRoot) {
    var root = sectionOrRoot || document;
    var sections;

    if (root.matches && root.matches("section")) {
      sections = [root];
    } else {
      sections = Array.from(root.querySelectorAll(".slides section"));
    }

    sections.forEach(function (section) {
      if (section.closest("aside.notes")) {
        return;
      }

      clearGenerated(section);

      var hints = parseCommentHints(section);
      var layout = parseLayoutHint(hints.layout) || inferLayout(section);
      var accent = hints.accent ? hints.accent.trim().toLowerCase() : null;
      var paneSurface = hints["pane-surface"] ? hints["pane-surface"].trim().toLowerCase() : null;

      if (!layout) {
        section.removeAttribute("data-dz-layout");
        section.removeAttribute("data-dz-orientation");
        section.removeAttribute("data-dz-pane-modes");
      } else {
        section.dataset.dzLayout = layout.primitive;
        section.dataset.dzOrientation = layout.orientation;
        if (layout.paneModes) {
          section.dataset.dzPaneModes = layout.paneModes.join("-");
        } else {
          section.removeAttribute("data-dz-pane-modes");
        }
      }

      if (accent) {
        section.dataset.dzAccent = accent;
      } else {
        section.removeAttribute("data-dz-accent");
      }

      if (paneSurface === "none") {
        section.dataset.dzPaneSurface = "none";
      } else {
        section.removeAttribute("data-dz-pane-surface");
      }

      section.setAttribute("data-dz-theme-transition", "true");

      if (layout && layout.primitive === "split") {
        ensureSplitStructure(section, layout);
      }
    });
  }

  function autoApply() {
    apply(document);

    if (global.Reveal && typeof global.Reveal.on === "function") {
      global.Reveal.on("ready", function () {
        apply(document);
      });
      global.Reveal.on("slidechanged", function (event) {
        if (event && event.currentSlide) {
          apply(event.currentSlide);
        }
      });
    }
  }

  var api = {
    apply: apply,
    inferLayout: inferLayout,
    parseLayoutHint: parseLayoutHint
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  global.Deckzero = api;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoApply, { once: true });
    } else {
      autoApply();
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
