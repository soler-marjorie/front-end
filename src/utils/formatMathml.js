// /utils/formatMathML.js

/**
 * Normalise les différentes représentations des opérateurs de multiplication.
 * @param {string} mathml - La chaîne MathML.
 * @returns {string} La chaîne MathML normalisée.
 */
function normalizeMultiplication(mathml) {
    // Remplace divers opérateurs de multiplication par le point centré (⋅).
    // ⁢ (U+2062), *, ×, ⋅, ·, ⁢
    const multiplicationRegex = /<\/(mi|mn)>\s*<mo[^>]*>\s*(\*|×|⋅|·|\u2062|⁢|⁢)\s*<\/mo>\s*<(mi|mn)>/g;
    return mathml.replace(multiplicationRegex, '</$1><mo>⋅</mo><$3>');
}


/**
 * Enveloppe le contenu entre parenthèses dans une balise <mrow> si nécessaire.
 * Cette fonction est récursive pour gérer les parenthèses imbriquées correctement.
 */
function wrapParenthesesContent(mathmlString) {
    const openParenRegex = /<mo[^>]*>\(<\/mo>/;
    const closeParenRegex = /<mo[^>]*>\)<\/mo>/;

    let result = "";
    let searchIndex = 0;

    while (searchIndex < mathmlString.length) {
        const remainingStr = mathmlString.substring(searchIndex);
        const openMatch = openParenRegex.exec(remainingStr);

        if (!openMatch) {
            result += remainingStr;
            break;
        }

        result += remainingStr.substring(0, openMatch.index);
        result += openMatch[0];

        let balance = 1;
        let contentStartIndex = searchIndex + openMatch.index + openMatch[0].length;
        let scanIndex = contentStartIndex;

        while (scanIndex < mathmlString.length && balance > 0) {
            const lookAhead = mathmlString.substring(scanIndex);
            const nextOpen = openParenRegex.exec(lookAhead);
            const nextClose = closeParenRegex.exec(lookAhead);

            const openPos = nextOpen ? nextOpen.index : -1;
            const closePos = nextClose ? nextClose.index : -1;

            if (closePos !== -1 && (openPos === -1 || closePos < openPos)) {
                balance--;
                scanIndex += closePos + nextClose[0].length;
            } else if (openPos !== -1) {
                balance++;
                scanIndex += openPos + nextOpen[0].length;
            } else {
                break; // Parenthèse non fermée
            }
        }
        
        if (balance === 0) {
            const contentEndIndex = scanIndex - closeParenRegex.exec(mathmlString.substring(0, scanIndex)).pop().length;
            const innerContent = mathmlString.substring(contentStartIndex, contentEndIndex);
            
            // Traitement récursif du contenu interne
            const processedInnerContent = wrapParenthesesContent(innerContent);
            
            // Envelopper si ce n'est pas un unique <mrow>
            const trimmedContent = processedInnerContent.trim();
            if (!trimmedContent.startsWith('<mrow') || !trimmedContent.endsWith('</mrow>')) {
                result += `<mrow>${processedInnerContent}</mrow>`;
            } else {
                result += processedInnerContent;
            }
            
            result += mathmlString.substring(contentEndIndex, scanIndex); // Ajoute la parenthèse fermante
            searchIndex = scanIndex;

        } else { // Pas de parenthèse fermante trouvée
            result += mathmlString.substring(contentStartIndex);
            break;
        }
    }
    return result;
}

/**
 * Formate, nettoie et indente une chaîne MathML, en lui ajoutant des IDs uniques.
 * @param {string} mathml - La chaîne MathML brute.
 * @returns {string} La chaîne MathML formatée.
 */
export function formatMathML(mathml) {
    if (!mathml || typeof mathml !== 'string') return '';

    let processed = mathml;
    
    // 1. Remplacements et normalisations
    processed = normalizeMultiplication(processed);
    processed = processed.replace(/<mo[^>]*>(\u00B1|±|±|±)<\/mo>/g, '<mo>+</mo>');
    processed = processed.replace(/<mo[^>]*>−<\/mo>/g, '<mo>-</mo>');
    processed = processed.replace(/<mi[^>]*>abs<\/mi>/g, '<mo>abs</mo>');
    processed = processed.replace(/<mfenced([^>]*)>/g, '<mo>(</mo>');
    processed = processed.replace(/<\/mfenced>/g, '<mo>)</mo>');

    // 2. Gestion des parenthèses
    let previous;
    do {
        previous = processed;
        processed = wrapParenthesesContent(processed);
    } while (processed !== previous);


    // 3. Enlever le wrapper <math> existant pour éviter les doublons
    const mathTagRegex = /^\s*<math[^>]*>(.*)<\/math>\s*$/is;
    const match = processed.match(mathTagRegex);
    processed = match ? match[1].trim() : processed.trim();

    // 4. Ajouter un wrapper <math> canonique et indenter
    processed = `<math xmlns="http://www.w3.org/1998/Math/MathML">${processed}</math>`;

    let indent = 0;
    let result = '';
    let idCounter = 0;
    const targetTags = ["math", "mi", "mn", "mo", "msqrt", "mfrac", "msup", "mrow"];

    // Indentation et ajout d'ID
    processed.replace(/<(\/)?([a-zA-Z0-9]+)([^>]*)>/g, (match, isClosing, tagName, attrs) => {
        if (isClosing) {
            indent -= 2;
            if (indent < 0) indent = 0;
        }
        
        let fullTag = match;
        if (!isClosing && targetTags.includes(tagName) && !attrs.includes('id=')) {
            idCounter++;
            const idAttr = ` id="${idCounter}"`;
            if (attrs.endsWith('/')) {
                fullTag = `<${tagName}${attrs.slice(0, -1)}${idAttr} />`;
            } else {
                fullTag = `<${tagName}${attrs}${idAttr}>`;
            }
        }
        
        result += '\n' + ' '.repeat(indent) + fullTag;
        
        if (!isClosing && !attrs.endsWith('/')) {
            indent += 2;
        }
    });

    return result.trim();
}