// xsltConvert.ts
import SaxonJS from 'saxon-js';

/**
 * Transforme du Presentation-MathML en Content-MathML
 * en utilisant Saxon-JS et votre SEF JSON.
 */
export async function applyXslt(
  presMathML: string
): Promise<string> {
  if (typeof presMathML !== 'string' || !presMathML.trim()) {
    throw new Error('applyXslt appelé sans chaîne MathML valide');
  }

  try {
    const result = await SaxonJS.transform({
      stylesheetFileName: '/xsl/pmathml-to-cmathml.sef.json',
      sourceText: presMathML,
      destination: 'serialized'
    });
    return result.principalResult as string;
  } catch (err) {
    console.error('Erreur de transformation Saxon-JS :', err);
    throw err;
  }
}