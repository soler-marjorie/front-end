export async function convertPresentationToContent(presentationMathML) {
  if (!window.SaxonJS) {
    // Charger SaxonJS dynamiquement s’il n’est pas encore disponible
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = '/saxon-js/SaxonJS2.js';
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
  }
  const res = await fetch('/xsl/convert.sef.json');
  const text = await res.text();
  const sef = JSON.parse(text); // Cela lèvera une erreur si le contenu n'est pas du JSON valide

  // Lancer la transformation
  const result = await window.SaxonJS.transform({
    stylesheetInternal: sef,
    sourceText: presentationMathML,
    destination: 'serialized'
  }, 'async')
  
  // Retourner le contenu transformé (Content MathML)
  return result.principalResult
}