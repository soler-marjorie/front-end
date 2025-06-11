// Helper function to check if content is already properly wrapped by a single, all-encompassing <mrow>
function isProperlyWrappedByMrow(content) {
    const trimmed = content.trim();
    // An empty content string is not considered "properly wrapped" by an mrow
    // in a way that would prevent adding a new one for <mo>(</mo) <mo>)</mo>.
    // It should become <mo>(</mo><mrow></mrow><mo>)</mo after processing.
    if (trimmed === "") return false; 

    const matchOpenMrow = trimmed.match(/^<mrow(?:\s+[^>]*)?>/); // Matches <mrow> or <mrow attr="val">
    if (matchOpenMrow && trimmed.endsWith("</mrow>")) {
        let mrowBalance = 0;
        let k = 0;
        let malformedOrClosedEarly = false;
        let firstTagIsMrow = false;
        let firstTagProcessed = false; 

        while (k < trimmed.length) {
            if (trimmed[k] === '<') {
                const tagEndScanIndex = trimmed.indexOf('>', k);
                if (tagEndScanIndex === -1) { malformedOrClosedEarly = true; break; }
                
                const fullTag = trimmed.substring(k, tagEndScanIndex + 1);
                const isSelfClosing = fullTag.endsWith('/>');
                
                if (!firstTagProcessed && !trimmed.substring(0, k).trim()) {
                    firstTagProcessed = true;
                    if (fullTag.match(/^<mrow(?:\s+[^>]*)?>/)) {
                        firstTagIsMrow = true;
                    } else {
                        malformedOrClosedEarly = true; 
                        break;
                    }
                }
                
                if (fullTag.match(/^<mrow(?:\s+[^>]*)?>/)) {
                    if (!isSelfClosing) mrowBalance++;
                } else if (fullTag.startsWith("</mrow")) {
                    mrowBalance--;
                    if (mrowBalance < 0) { // More closing than opening mrows encountered
                        malformedOrClosedEarly = true;
                        break;
                    }
                }
                
                if (firstTagIsMrow && mrowBalance === 0 && (tagEndScanIndex < trimmed.length - 1) && trimmed.substring(tagEndScanIndex + 1).trim() !== "") {
                    // The initial <mrow> closed, but there's more non-whitespace content after it.
                    malformedOrClosedEarly = true; 
                    break;
                }
                k = tagEndScanIndex + 1;
            } else {
                k++;
            }
        }
        return firstTagIsMrow && mrowBalance === 0 && !malformedOrClosedEarly;
    }
    return false;
}

// Define regex constants outside transformParensContent for performance and clarity
const _openParenRegex = /<mo[^>]*>\(<\/mo>/;
const _closeParenRegex = /<mo[^>]*>\)<\/mo>/;

/**
 * Recursively processes the MathML string to ensure content within <mo>(</mo>...</mo>)
 * is wrapped by <mrow>...</mrow> if not already appropriately wrapped.
 * @param {string} mathmlString The input MathML string fragment.
 * @returns {string} The transformed MathML string fragment.
 */
function transformParensContent(mathmlString) {
  let processedUpTo = 0;
  let result = "";

  while (processedUpTo < mathmlString.length) {
    const remainingSearchString = mathmlString.substring(processedUpTo);
    
    const openMatch = _openParenRegex.exec(remainingSearchString);

    if (!openMatch) {
      result += remainingSearchString; // Append rest of the string if no more open parens
      break;
    }

    const openParenRelativeStartIndex = openMatch.index;
    const openParenTag = openMatch[0];
    
    // Append content before this open parenthesis
    result += remainingSearchString.substring(0, openParenRelativeStartIndex);

    const globalOpenParenStartIndex = processedUpTo + openParenRelativeStartIndex;
    const globalContentStartIndex = globalOpenParenStartIndex + openParenTag.length;

    // Find matching <mo>)</mo> using a balance counter for nested parentheses
    let balance = 1;
    let scanIndex = globalContentStartIndex;
    let foundClosingParen = false;
    let contentEndIndex = -1;       // End of inner content, start of closeParenTagFound
    let closeParenTagFound = "";
    let closeParenTagEndIndex = -1; // End of closeParenTagFound globally

    while (scanIndex < mathmlString.length) {
      const lookAheadString = mathmlString.substring(scanIndex);
      
      const nextOpenMatch = _openParenRegex.exec(lookAheadString);
      const nextCloseMatch = _closeParenRegex.exec(lookAheadString);

      const nextOpenIndexInLookAhead = nextOpenMatch ? nextOpenMatch.index : -1;
      const nextCloseIndexInLookAhead = nextCloseMatch ? nextCloseMatch.index : -1;
      
      if (nextCloseIndexInLookAhead !== -1 && 
          (nextOpenIndexInLookAhead === -1 || nextCloseIndexInLookAhead < nextOpenIndexInLookAhead)) {
        // Next token is a closing parenthesis
        balance--;
        if (balance === 0) { // Found the matching closing parenthesis
          contentEndIndex = scanIndex + nextCloseIndexInLookAhead;
          closeParenTagFound = nextCloseMatch[0];
          closeParenTagEndIndex = contentEndIndex + closeParenTagFound.length;
          foundClosingParen = true;
          break;
        }
        // Advance scanIndex past this closing parenthesis token
        scanIndex += nextCloseIndexInLookAhead + nextCloseMatch[0].length;
      } else if (nextOpenIndexInLookAhead !== -1) {
        // Next token is an opening parenthesis
        balance++;
        // Advance scanIndex past this opening parenthesis token
        scanIndex += nextOpenIndexInLookAhead + nextOpenMatch[0].length;
      } else {
        // No more parenthesis tokens found, or malformed
        break; 
      }
    }

    if (foundClosingParen) {
      const originalInnerContent = mathmlString.substring(globalContentStartIndex, contentEndIndex);
      
      // Recursively transform the content within these parentheses
      const processedInnerContent = transformParensContent(originalInnerContent);

      // Determine if the (potentially modified) innerContent needs to be wrapped by a new <mrow>
      // for the current pair of parentheses.
      // An empty inner content (e.g. from <mo>(</mo><mo>)</mo> ) should be wrapped: <mo>(</mo><mrow></mrow><mo>)</mo>
      const needsCurrentLevelWrapping = (processedInnerContent.trim() === "") ? true : !isProperlyWrappedByMrow(processedInnerContent);
      
      result += openParenTag;
      if (needsCurrentLevelWrapping) {
        result += "<mrow>" + processedInnerContent + "</mrow>";
      } else {
        result += processedInnerContent; // Already properly wrapped, or doesn't need it
      }
      result += closeParenTagFound;
      
      processedUpTo = closeParenTagEndIndex;

    } else { 
      // No matching closing parenthesis found for the current openMatch.
      // Append the open parenthesis tag and the rest of the string from that point.
      result += openParenTag;
      result += mathmlString.substring(globalContentStartIndex);
      processedUpTo = mathmlString.length; // Mark as processed till end
      break; 
    }
  }
  return result;
}


export function formatMathML(mathml) {
  // Original pre-processing steps
  mathml = mathml.replace(/&InvisibleTimes;/g, '\u2062');
  mathml = mathml.replace(/<\/(mi|mn)>\s*<mo[^>]*>\s*(\*|×|⋅|·|\u2062)\s*<\/mo>\s*<(mi|mn)>/g,'</$1><mo>⋅</mo><$3>');
  mathml = mathml.replace(/<mo[^>]*>(\u00B1|±|±|±|&PlusMinus;|&#177;)<\/mo>/g, '<mo>+</mo>');
  mathml = mathml.replace(/<mo[^>]*>−<\/mo>/g, '<mo>-</mo>');
  mathml = mathml.replace(/<mi[^>]*>abs<\/mi>/g, '<mo>abs</mo>');
  mathml = mathml.replace(/<mfenced[^>]*>/g, '<mo>\(<\/mo>');
  mathml = mathml.replace(/<\/mfenced[^>]*>/g, '<mo>\)<\/mo>');

  // Add mrow wrapper inside <mo>(</mo> ... <mo>)</mo> if not already present, handling nesting.
  // Loop until no more changes are made by transformParensContent.
  let previousMathML;
  do {
    previousMathML = mathml;
    mathml = transformParensContent(mathml);
  } while (mathml !== previousMathML);

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
  const targetTags = ["math", "mi", "mn", "mo", "msqrt", "mfrac", "msup", "msub", "msubsup", "mrow", "mtable", "mtd", "mtr", "mfenced", "munderover", "munder", "menclose", "mpadded", "mphantom", "ms", "mtext", "mstyle", "merror", "semantics", "annotation", "annotation-xml"];

  while (i < len) {
    if (mathml[i] === '<') {
      const tagEnd = mathml.indexOf('>', i);
      if (tagEnd === -1) { // Malformed MathML or end of string
        result += mathml.substring(i);
        break;
      }
      let fullTag = mathml.substring(i, tagEnd + 1);
      const isClosingTag = fullTag.startsWith('</');
      const tagNameMatch = fullTag.match(/<\/?([^\s>\/]+)/); // Extracts tag name
      const tagName = tagNameMatch ? tagNameMatch[1] : null;

      if (isClosingTag) {
        indent -= 2;
        if (indent < 0) indent = 0;
        if (tagStack.length > 0) { // Ensure stack is not empty before popping
          tagStack.pop();
        }

        // Original formatting distinction for certain closing tags
        if (tagName && ["mi", "mn", "mo"].includes(tagName)) {
          result += fullTag + '\n'; 
        } else {
          result += '\n' + ' '.repeat(indent) + fullTag + '\n'; 
        }
      }
      // Opening tag or self-closing tag
      else {
        if (tagName && targetTags.includes(tagName)) {
          if (!/\s+id\s*=\s*["']/.test(fullTag)) {
            idCounter++;
            const idAttribute = ` id=\"${idCounter}\"`;

            if (fullTag.endsWith('/>')) { 
              const tagContentBeforeSlash = fullTag.substring(0, fullTag.length - 2).trimRight();
              fullTag = tagContentBeforeSlash + idAttribute + ' />';
            } else { 
              const tagContentBeforeBracket = fullTag.substring(0, fullTag.length - 1);
              fullTag = tagContentBeforeBracket + idAttribute + '>';
            }
          }
        }
        result += '\n' + ' '.repeat(indent) + fullTag;

        if (!fullTag.endsWith('/>')) { 
          tagStack.push(tagName);
          indent += 2;
        }
      }
      i = tagEnd + 1;
    } else { // Text content
      const nextTag = mathml.indexOf('<', i);
      const contentEnd = (nextTag !== -1) ? nextTag : len;
      const content = mathml.substring(i, contentEnd).trim(); 

      if (content) {
        result += content;
      }
      i = contentEnd;
    }
  }

  // Original post-processing steps. Using [a-zA-Z0-9\\-]+ for tag names in regex.
  return result.replace(/\n\n+/g, '\n').trim().replace(/^<math/, '\n<math')
    .replace(/(<\/[a-zA-Z0-9\-]+>)(<[a-zA-Z0-9\-\/])/g, '$1\n$2');
}