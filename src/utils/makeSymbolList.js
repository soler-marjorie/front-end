export function makeSymbolList(mathmlString) {
  if (!mathmlString || typeof mathmlString !== 'string') {
    console.warn("L'entrée MathML est invalide ou vide.");
    return [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(mathmlString, "application/xml");

  const parseError = doc.getElementsByTagName("parsererror");
  if (parseError.length > 0) {
    console.error("Erreur lors du parsing du MathML:", parseError[0].textContent);
    return [];
  }

  const ciElements = doc.querySelectorAll("ci");

  // Utiliser un Set pour stocker les contenus uniques
  const uniqueCiContentsSet = new Set();

  ciElements.forEach(ciElement => {
    if (ciElement.textContent) {
      uniqueCiContentsSet.add(ciElement.textContent.trim()); // .add() au lieu de .push()
    }
  });

  // Convertir le Set en tableau
  return Array.from(uniqueCiContentsSet);
}
