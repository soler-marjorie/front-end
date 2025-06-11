// Fonction utilitaire pour nettoyer le string MathML
function getCleanedOuterHTML(elementOrString, isRootMathTag = false) {
  let htmlString;
  if (typeof elementOrString === 'string') {
    htmlString = elementOrString;
  } else if (elementOrString && elementOrString.outerHTML) {
    htmlString = elementOrString.outerHTML;
  } else {
    return "<!-- Invalid input to getCleanedOuterHTML -->";
  }

  if (!isRootMathTag) {
    const xmlnsRegex = /(\s|^)xmlns\s*=\s*(["'])http:\/\/www\.w3\.org\/1998\/Math\/MathML\2/gi;
    htmlString = htmlString.replace(xmlnsRegex, (match, p1) => p1);
  }

  let cleanedHtml = htmlString.replace(/\n/g, "");
  cleanedHtml = cleanedHtml.replace(/\\/g, ""); 
  cleanedHtml = cleanedHtml.replace(/\s*([<>])\s*/g, '$1');
  cleanedHtml = cleanedHtml.replace(/\s{2,}/g, " ");
  cleanedHtml = cleanedHtml.trim();
  return cleanedHtml;
}


export function enrichTreeWithMathML(mathmlString, rootNodeObject) {
  const parser = new DOMParser();
  const mathDoc = parser.parseFromString(mathmlString, "application/xml");

  const parsingErrors = mathDoc.getElementsByTagName("parsererror");
  if (parsingErrors.length > 0) {
    console.error("MathML Parsing Error:", parsingErrors[0].textContent);
  }

  const MATHML_NS = "http://www.w3.org/1998/Math/MathML";

  function findLowestCommonAncestor(elements) {
    if (!elements || elements.length === 0) return null;
    if (elements.length === 1) return elements[0];
    
    let ancestor = elements[0];
    while (ancestor) {
      const isCommon = elements.slice(1).every(el => ancestor.contains(el));
      if (isCommon) return ancestor;
      ancestor = ancestor.parentElement;
    }
    return null;
  }

  function isParenthesized(element) {
    if (!element) return false;
    const parent = element.parentElement;
    if (!parent || parent.tagName.toLowerCase() !== 'mrow') return false;
    
    const children = Array.from(parent.children);
    const elementIndex = children.indexOf(element);
    
    if (elementIndex === -1) return false;
    
    const hasOpen = elementIndex > 0 && children[elementIndex-1].tagName.toLowerCase() === 'mo' && children[elementIndex-1].textContent.trim() === '(';
    const hasClose = elementIndex < children.length - 1 && children[elementIndex+1].tagName.toLowerCase() === 'mo' && children[elementIndex+1].textContent.trim() === ')';
    
    return hasOpen && hasClose;
  }
  
  function stripOuterParentheses(element) {
      if (!element || element.tagName.toLowerCase() !== 'mrow' || element.children.length < 3) {
          return element;
      }
      const children = Array.from(element.children);
      const first = children[0];
      const last = children[children.length - 1];

      const isWrapped = first.tagName.toLowerCase() === 'mo' && first.textContent.trim() === '(' &&
                        last.tagName.toLowerCase() === 'mo' && last.textContent.trim() === ')';

      if (isWrapped) {
          if (children.length === 3) return children[1];
          const newMrow = mathDoc.createElementNS(MATHML_NS, 'mrow');
          children.slice(1, -1).forEach(child => newMrow.appendChild(child.cloneNode(true)));
          return newMrow;
      }
      return element;
  }

  function buildSubtreeAsMathML(node) {
    if (!node) return null;
    const mathmlElement = mathDoc.getElementById(node.id);
    if (!mathmlElement) return null;

    if (!node.children || node.children.length === 0) {
      return mathmlElement.cloneNode(true);
    }

    let reconstructedElement;
    const tagName = mathmlElement.tagName.toLowerCase();
    
    const childrenNodes = node.children.filter(c => {
        const el = mathDoc.getElementById(c.id);
        return el && !['(',')'].includes(el.textContent.trim());
    });

    if (tagName === 'mo') {
        const operatorText = mathmlElement.textContent.trim();
        const mrow = mathDoc.createElementNS(MATHML_NS, "mrow");

        // --- CAS SPÉCIAL POUR LA VALEUR ABSOLUE ---
        if (operatorText === '|') {
            const openBar = mathmlElement.cloneNode(true);
            const closeBar = mathmlElement.cloneNode(true); // Crée une barre fermante identique
            const content = buildSubtreeAsMathML(childrenNodes[0]);
            
            mrow.appendChild(openBar);
            if (content) mrow.appendChild(content);
            mrow.appendChild(closeBar);
        }
        // --- LOGIQUE EXISTANTE POUR LES AUTRES OPÉRATEURS ---
        else if (childrenNodes.length === 1) { // Unaire
            mrow.appendChild(mathmlElement.cloneNode(true));
            mrow.appendChild(buildSubtreeAsMathML(childrenNodes[0]));
        } else if (childrenNodes.length > 1) { // Binaire ou chaîné
            mrow.appendChild(buildSubtreeAsMathML(childrenNodes[0]));
            for(let i = 1; i < childrenNodes.length; i++) {
                mrow.appendChild(mathmlElement.cloneNode(true));
                mrow.appendChild(buildSubtreeAsMathML(childrenNodes[i]));
            }
        } else {
             return mathmlElement.cloneNode(true);
        }
        reconstructedElement = mrow;
    } else {
        const newContainer = mathmlElement.cloneNode(false);
        for (const childNode of node.children) {
            const childSubtree = buildSubtreeAsMathML(childNode);
            if (childSubtree) newContainer.appendChild(childSubtree);
        }
        reconstructedElement = newContainer;
    }
    
    const childDOMElements = childrenNodes.map(n => mathDoc.getElementById(n.id)).filter(Boolean);
    const lca = findLowestCommonAncestor(childDOMElements.length > 0 ? childDOMElements : [mathmlElement]);

    if (lca && isParenthesized(lca)) {
        const wrapper = mathDoc.createElementNS(MATHML_NS, 'mrow');
        const openParen = mathDoc.createElementNS(MATHML_NS, 'mo');
        openParen.textContent = '(';
        const closeParen = mathDoc.createElementNS(MATHML_NS, 'mo');
        closeParen.textContent = ')';
        
        wrapper.appendChild(openParen);
        wrapper.appendChild(reconstructedElement);
        wrapper.appendChild(closeParen);
        return wrapper;
    }

    return reconstructedElement;
  }

  function enrichNode(node) {
    if (!node || typeof node.id === 'undefined') return null;
    const mathmlElement = mathDoc.getElementById(node.id);
    if (!mathmlElement) return null;

    if (mathmlElement.tagName.toLowerCase() === 'mo') {
        const text = mathmlElement.textContent.trim();
        if (text === '(' || text === ')') return null;
    }

    const fullSubtree = buildSubtreeAsMathML(node) || mathmlElement;
    const nameSourceElement = stripOuterParentheses(fullSubtree);
    
    const mathmlContentForParentNode = getCleanedOuterHTML(nameSourceElement, false);
    const finalNameStringForParentNode = `<math xmlns="http://www.w3.org/1998/Math/MathML" id="${node.id}" mathsize="40pt">${mathmlContentForParentNode}</math>`;
    const parentNodeName = getCleanedOuterHTML(finalNameStringForParentNode, true);

    let enrichedChildren = node.children ? node.children.map(enrichNode).filter(Boolean) : [];

    let symbolTextContentForChild = null;
    const currentElementTagForSymbol = mathmlElement.tagName.toLowerCase();
    switch (currentElementTagForSymbol) {
        case 'msqrt': symbolTextContentForChild = '√'; break;
        case 'msup': symbolTextContentForChild = '^'; break;
        case 'mfrac': symbolTextContentForChild = '/'; break;
        case 'mo':
            const operatorTextForSymbol = mathmlElement.textContent.trim();
            if (operatorTextForSymbol === '*' || operatorTextForSymbol === '⋅') symbolTextContentForChild = 'x';
            else if (operatorTextForSymbol === '|') symbolTextContentForChild = 'abs';
            else if (operatorTextForSymbol !== '(' && operatorTextForSymbol !== ')') {
                 symbolTextContentForChild = operatorTextForSymbol;
            }
            break;
    }

    if (symbolTextContentForChild !== null) {
        const displayChildId = `${node.id}_display_symbol`;
        const escapedSymbolText = symbolTextContentForChild.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        const displayChildContentMathML = `<mtext>${escapedSymbolText}</mtext>`;
        const displayChildNameString = `<math xmlns="http://www.w3.org/1998/Math/MathML" id="${displayChildId}" mathsize="40pt">${displayChildContentMathML}</math>`;
        const displayChildName = getCleanedOuterHTML(displayChildNameString, true);
        const displayChild = {
            name: displayChildName, id: displayChildId, isOperator: true,
            color: node.color, value: 10 + Math.random() * 20, children: [],
        };
        enrichedChildren.push(displayChild);
    }

    return {
      name: parentNodeName, isOperator: false, ...node, children: enrichedChildren,
    };
  }

  if (!rootNodeObject) {
    console.warn("enrichTreeWithMathML a reçu rootNodeObject null/undefined.");
    return null;
  }
  return enrichNode(rootNodeObject);
}