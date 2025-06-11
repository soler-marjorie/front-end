export default function mathMLToTree(mathmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(mathmlString, "application/xml");

  function extractNodeTree(node) {
    const allowedTags = ["apply", "ci", "cn"];
    if (!allowedTags.includes(node.nodeName)) return null;

    const id = node.getAttribute("id");
    if (!id) return null;

    const color = node.getAttribute("color") || null;

    const children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      // Ensure we are only processing element nodes, not text nodes etc.
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childTree = extractNodeTree(child);
        if (childTree) children.push(childTree);
      }
    }

    const nodeData = { id, color, children };

    // Add 'value' attribute if the node has no children (is a leaf node)
    if (children.length === 0) {
      nodeData.value = 10 + Math.random() * 20;
    }

    return nodeData;
  }

  const result = [];
  const mathRoot = xmlDoc.querySelector("math");
  if (mathRoot) {
    for (const child of mathRoot.childNodes) {
      // Ensure we are only processing element nodes at the root level as well
      if (child.nodeType === Node.ELEMENT_NODE) {
        const nodeTree = extractNodeTree(child);
        if (nodeTree) result.push(nodeTree);
      }
    }
  }

  return result[0];
}