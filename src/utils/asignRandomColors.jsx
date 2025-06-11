export function colorizeMathML(mathMLString) {
  const colors = [
    "hsl(210, 60%, 85%)",
    "hsl(340, 60%, 86%)",
    "hsl(120, 50%, 80%)",
    "hsl(45, 100%, 85%)",
    "hsl(270, 60%, 85%)",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(mathMLString, "application/xml");

  // Les balises ciblées : apply, ci, cn
  const tagsToColor = ["apply", "ci", "cn"];

  let i = 0;

  tagsToColor.forEach((tag) => {
    const elements = xmlDoc.getElementsByTagName(tag);
    Array.from(elements).forEach((el) => {
      el.setAttribute("color", colors[i%5]);
      i += 1;
    });
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
}
