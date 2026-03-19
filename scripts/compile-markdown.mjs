function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function isBlockTag(tagName) {
  return /^(html|head|body|div|section|ul|ol|li|pre|code|script|style|p|h1|h2|h3|h4|h5|h6)$/.test(tagName);
}

function trimFenceIndent(lines) {
  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  var minIndent = null;

  lines.forEach(function (line) {
    if (line.trim() === "") {
      return;
    }

    var match = line.match(/^ */);
    var indent = match ? match[0].length : 0;
    if (minIndent === null || indent < minIndent) {
      minIndent = indent;
    }
  });

  if (!minIndent) {
    return lines.join("\n");
  }

  return lines
    .map(function (line) {
      return line.startsWith(" ".repeat(minIndent)) ? line.slice(minIndent) : line;
    })
    .join("\n");
}

function renderInline(text) {
  var tokens = [];
  var source = String(text);
  var pattern = /`([^`]+)`|!\[([^\]]*)\]\(([^)]+)\)/g;
  var lastIndex = 0;
  var match;

  while ((match = pattern.exec(source))) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        value: source.slice(lastIndex, match.index)
      });
    }

    if (match[1] !== undefined) {
      tokens.push({
        type: "code",
        value: match[1]
      });
    } else {
      tokens.push({
        type: "image",
        alt: match[2],
        src: match[3]
      });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < source.length) {
    tokens.push({
      type: "text",
      value: source.slice(lastIndex)
    });
  }

  return tokens
    .map(function (token) {
      if (token.type === "code") {
        return "<code>" + escapeHtml(token.value) + "</code>";
      }

      if (token.type === "image") {
        return '<img src="' + escapeAttribute(token.src) + '" alt="' + escapeAttribute(token.alt) + '" />';
      }

      return escapeHtml(token.value);
    })
    .join("");
}

function renderParagraph(lines) {
  var text = lines.join(" ").trim();
  if (/^!\[[^\]]*\]\([^)]+\)$/.test(text)) {
    return renderInline(text);
  }
  return "<p>" + renderInline(text) + "</p>";
}

function renderList(items) {
  return "<ul>\n" + items.map(function (item) {
    return "  <li>" + renderInline(item) + "</li>";
  }).join("\n") + "\n</ul>";
}

function renderHeading(line) {
  var match = line.match(/^(#{1,6})\s+(.*)$/);
  var level = match[1].length;
  return "<h" + level + ">" + renderInline(match[2].trim()) + "</h" + level + ">";
}

function renderCodeBlock(info, lines) {
  var language = info ? info.split(/\s+/)[0].trim() : "";
  var className = language ? ' class="language-' + escapeAttribute(language) + '"' : "";
  var code = trimFenceIndent(lines);
  return "<pre><code" + className + ' data-trim>\n' + code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n</code></pre>";
}

function isSlideSeparator(line) {
  return /^\s*---\s*$/.test(line);
}

function isCommentStart(line) {
  return /^\s*<!--/.test(line);
}

function isFenceStart(line) {
  return /^\s*```/.test(line);
}

function isListItem(line) {
  return /^\s*[-*]\s+/.test(line);
}

function isHeading(line) {
  return /^\s*#{1,6}\s+/.test(line);
}

function isRawHtmlStart(line) {
  var trimmed = line.trim();
  return /^<\/?[A-Za-z][^>]*>$/.test(trimmed) || /^<[A-Za-z][\s\S]*$/.test(trimmed);
}

function collectComment(lines, startIndex) {
  var chunk = [];
  var index = startIndex;

  while (index < lines.length) {
    chunk.push(lines[index]);
    if (lines[index].includes("-->")) {
      break;
    }
    index += 1;
  }

  return {
    html: chunk.join("\n"),
    nextIndex: index + 1
  };
}

function collectFence(lines, startIndex) {
  var info = lines[startIndex].replace(/^\s*```/, "").trim();
  var chunk = [];
  var index = startIndex + 1;

  while (index < lines.length && !/^\s*```/.test(lines[index])) {
    chunk.push(lines[index]);
    index += 1;
  }

  return {
    html: renderCodeBlock(info, chunk),
    nextIndex: index < lines.length ? index + 1 : index
  };
}

function collectList(lines, startIndex) {
  var items = [];
  var index = startIndex;

  while (index < lines.length && isListItem(lines[index])) {
    items.push(lines[index].replace(/^\s*[-*]\s+/, "").trim());
    index += 1;
  }

  return {
    html: renderList(items),
    nextIndex: index
  };
}

function collectRawHtml(lines, startIndex) {
  var chunk = [];
  var index = startIndex;
  var depth = 0;

  while (index < lines.length) {
    var line = lines[index];
    var trimmed = line.trim();
    chunk.push(line);

    var tagMatch = trimmed.match(/^<\/?([A-Za-z][\w-]*)\b[^>]*>/);
    var isVoid = /\/>$/.test(trimmed) || /^<(img|br|hr|input|meta|link)\b/i.test(trimmed);

    if (tagMatch && !isVoid) {
      if (/^<\//.test(trimmed)) {
        depth = Math.max(0, depth - 1);
      } else if (!/^<!/.test(trimmed)) {
        depth += 1;
        if (trimmed.includes("</" + tagMatch[1] + ">")) {
          depth = Math.max(0, depth - 1);
        }
      }
    }

    index += 1;

    if (depth === 0) {
      break;
    }
  }

  return {
    html: chunk.join("\n"),
    nextIndex: index
  };
}

function collectParagraph(lines, startIndex) {
  var chunk = [];
  var index = startIndex;

  while (index < lines.length) {
    var line = lines[index];
    if (!line.trim()) {
      break;
    }
    if (isHeading(line) || isListItem(line) || isFenceStart(line) || isCommentStart(line) || isRawHtmlStart(line)) {
      break;
    }
    chunk.push(line.trim());
    index += 1;
  }

  return {
    html: renderParagraph(chunk),
    nextIndex: index
  };
}

function splitSlides(markdown) {
  var lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  var slides = [];
  var current = [];

  lines.forEach(function (line) {
    if (isSlideSeparator(line)) {
      slides.push(current.join("\n"));
      current = [];
      return;
    }

    current.push(line);
  });

  slides.push(current.join("\n"));

  return slides
    .map(function (slide) {
      return slide.trim();
    })
    .filter(Boolean);
}

function compileSlide(markdown) {
  var lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  var parts = [];
  var index = 0;

  while (index < lines.length) {
    var line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (isCommentStart(line)) {
      var comment = collectComment(lines, index);
      parts.push(comment.html);
      index = comment.nextIndex;
      continue;
    }

    if (isFenceStart(line)) {
      var fence = collectFence(lines, index);
      parts.push(fence.html);
      index = fence.nextIndex;
      continue;
    }

    if (isHeading(line)) {
      parts.push(renderHeading(line.trim()));
      index += 1;
      continue;
    }

    if (isListItem(line)) {
      var list = collectList(lines, index);
      parts.push(list.html);
      index = list.nextIndex;
      continue;
    }

    if (isRawHtmlStart(line)) {
      var html = collectRawHtml(lines, index);
      parts.push(html.html);
      index = html.nextIndex;
      continue;
    }

    var paragraph = collectParagraph(lines, index);
    parts.push(paragraph.html);
    index = paragraph.nextIndex;
  }

  return "<section>\n" + parts.join("\n") + "\n</section>";
}

export function compileMarkdownDeck(markdown) {
  return splitSlides(markdown).map(compileSlide).join("\n\n");
}

export function formatHtml(html) {
  var lines = String(html)
    .replace(/\r\n/g, "\n")
    .split("\n");
  var indent = 0;

  return lines
    .map(function (line) {
      var trimmed = line.trim();
      if (!trimmed) {
        return "";
      }

      var closingMatch = trimmed.match(/^<\/([A-Za-z][\w-]*)>/);
      if (closingMatch && isBlockTag(closingMatch[1].toLowerCase())) {
        indent = Math.max(0, indent - 1);
      }

      var formatted = "  ".repeat(indent) + trimmed;

      if (/^<!DOCTYPE/i.test(trimmed) || /^<!--/.test(trimmed)) {
        return formatted;
      }

      var openingMatch = trimmed.match(/^<([A-Za-z][\w-]*)\b[^>]*>$/);
      var isClosing = /^<\//.test(trimmed);
      var isSelfClosing = /\/>$/.test(trimmed);
      var closesSameLine = /^<([A-Za-z][\w-]*)\b[^>]*>.*<\/\1>$/.test(trimmed);

      if (
        openingMatch &&
        !isClosing &&
        !isSelfClosing &&
        !closesSameLine &&
        isBlockTag(openingMatch[1].toLowerCase())
      ) {
        indent += 1;
      }

      return formatted;
    })
    .join("\n") + "\n";
}
