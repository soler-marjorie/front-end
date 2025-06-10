export function FormatMathML(mathml) {
  // Original pre-processing steps
  mathml = mathml.replace(/&InvisibleTimes;/g, '\u2062');
  mathml = mathml.replace(/<\/(mi|mn)>\s*<mo[^>]*>\s*(\*|×|⋅|·|\u2062)\s*<\/mo>\s*<(mi|mn)>/g,'</$1><mo>⋅</mo><$3>');
  mathml = mathml.replace(/<mo[^>]*>(\u00B1|±|±|±|&PlusMinus;|&#177;)<\/mo>/g, '<mo>+</mo>');
  mathml = mathml.replace(/<mo[^>]*>−<\/mo>/g, '<mo>-</mo>');
  mathml = mathml.replace(/<mi[^>]*>abs<\/mi>/g, '<mo>abs</mo>');
  mathml = mathml.replace(/<mfenced[^>]*>/g, '<mo>(</mo>');
  mathml = mathml.replace(/<\/mfenced[^>]*>/g, '<mo>)</mo>');

  // Strip existing <math> wrapper if present, to avoid nested <math> tags, and use its content
  const mathTagRegex = /^\s*<math[^>]*>(.*)<\/math>\s*$/is;
  const match = mathml.match(mathTagRegex);
  if (match && match[1]) {
    mathml = match[1].trim(); // Use only content of existing math tag
  } else {
    // If no math tag, it might be a fragment. Trim it.
    mathml = mathml.trim();
  }

  // Wrap with a canonical <math> tag. The ID for this root <math> tag will be added by the loop.
  mathml = `<math xmlns="http://www.w3.org/1998/Math/MathML">${mathml}</math>`;

  let indent = 0;
  let result = '';
  let i = 0;
  const len = mathml.length;
  const tagStack = [];
  let idCounter = 0; // For generating unique IDs
  // Define target tags that should receive an ID
  const targetTags = ["math", "mi", "mn", "mo", "msqrt", "mfrac", "msup", "msub", "msubsup", "mrow", "mtable", "mtd", "mtr", "mfenced", "munderover", "munder", "menclose", "mpadded", "mphantom", "ms", "mtext", "mstyle", "merror", "semantics", "annotation", "annotation-xml"]; // Added "mfenced"

  while (i < len) {
    if (mathml[i] === '<') {
      const tagEnd = mathml.indexOf('>', i);
      if (tagEnd === -1) { // Malformed MathML or end of string
        result += mathml.substring(i);
        break;
      }
      let fullTag = mathml.substring(i, tagEnd + 1);
      const isClosingTag = fullTag.startsWith('</');
      const tagNameMatch = fullTag.match(/<\/?([^\s>/]+)/); // Extracts tag name
      const tagName = tagNameMatch ? tagNameMatch[1] : null;

      if (isClosingTag) {
        indent -= 2;
        if (indent < 0) indent = 0;
        if (tagStack.length > 0) { // Ensure stack is not empty before popping
          tagStack.pop();
        }

        // Original formatting distinction for certain closing tags
        if (tagName && ["mi", "mn", "mo"].includes(tagName)) {
          result += fullTag + '\n'; // Appends tag, then newline. Assumes content was on same line.
        } else {
          result += '\n' + ' '.repeat(indent) + fullTag + '\n'; // Standard: newline, indent, tag, newline
        }
      }
      // Opening tag or self-closing tag
      else {
        if (tagName && targetTags.includes(tagName)) {
          // Check if an 'id' attribute already exists (simple check)
          if (!/\s+id\s*=\s*["']/.test(fullTag)) {
            idCounter++;
            const idAttribute = ` id="${idCounter}"`;

            // Insert the ID attribute before the closing '>' or '/>'
            if (fullTag.endsWith('/>')) { // Self-closing tag
              const tagContentBeforeSlash = fullTag.substring(0, fullTag.length - 2).trimRight();
              fullTag = tagContentBeforeSlash + idAttribute + ' />';
            } else { // Normal opening tag
              const tagContentBeforeBracket = fullTag.substring(0, fullTag.length - 1);
              fullTag = tagContentBeforeBracket + idAttribute + '>';
            }
          }
        }
        result += '\n' + ' '.repeat(indent) + fullTag;

        if (!fullTag.endsWith('/>')) { // If not self-closing, push to stack and indent further
          tagStack.push(tagName);
          indent += 2;
        }
      }
      i = tagEnd + 1;
    } else { // Text content
      const nextTag = mathml.indexOf('<', i);
      const contentEnd = (nextTag !== -1) ? nextTag : len;
      const content = mathml.substring(i, contentEnd).trim(); // Trim whitespace around text content

      if (content) {
        // Content directly follows the opening tag (which already includes newline and indent)
        result += content;
      }
      i = contentEnd;
    }
  }

  // Original post-processing steps. Using [a-zA-Z0-9\\-]+ for tag names in regex.
  return result.replace(/\n\n+/g, '\n').trim().replace(/^<math/, '\n<math')
    .replace(/(<\/[a-zA-Z0-9-]+>)(<[a-zA-Z0-9\-/])/g, '$1\n$2');
}