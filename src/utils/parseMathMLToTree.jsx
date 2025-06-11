export function parseMathMLToTree(mathml) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(`<root>${mathml}</root>`, 'application/xml');
    const listColors = ["hsl(210, 60%, 85%)", "hsl(340, 60%, 86%)", "hsl(120, 50%, 80%)", "hsl(45, 100%, 85%)", "hsl(270, 60%, 85%)"];
    let key = 0;

    function wrapInMathTag(content) {
        key += 1;
        const cleanedContent = content.replace(/xmlns="[^"]*"/g, '');
        return `<math xmlns="http://www.w3.org/1998/Math/MathML" id="${key}" mathsize="40pt">${cleanedContent}</math>`;
    }

    function walk(node, depth) {
        depth += 1;  
        const tag = node.tagName;
        if (!tag) return null;

        switch (tag) {
            case 'mo':
                if (node.outerHTML== '<mo>\u2062</mo>'){
                    return { name: wrapInMathTag('<mo>x</mo>'), value: 10 + Math.random() * 20, color: listColors[(depth-1) % 5]};
                }else{
                    return { name: wrapInMathTag(node.outerHTML), value: 10 + Math.random() * 20, color: listColors[(depth-1) % 5]};
                }
            case 'mi':
            case 'mn':
                return { name: wrapInMathTag(node.outerHTML), value: 10 + Math.random() * 20, color: listColors[depth % 5]};
            case 'msup':
                if (node.children.length === 2) {
                    const emptySupHTML = wrapInMathTag('<mi>^</mi>');
                    return {
                        name: wrapInMathTag(node.outerHTML),
                        color: listColors[depth % 5],
                        children: [
                            { name: emptySupHTML, color: listColors[depth % 5], value: 10 + Math.random() * 20 },
                            walk(node.children[0], depth),
                            walk(node.children[1], depth)
                        ].filter(Boolean)
                    };
                }
                break;
            case 'mfrac':
                if (node.children.length === 2) {
                    const emptyFracHTML = wrapInMathTag('<mi>/</mi>');
                    return {
                        name: wrapInMathTag(node.outerHTML),
                        color: listColors[depth % 5],
                        children: [
                            { name: emptyFracHTML, color: listColors[depth % 5], value: 10 + Math.random() * 20 },
                            walk(node.children[0], depth),
                            walk(node.children[1], depth)
                        ].filter(Boolean)
                    };
                }
                break;
            case 'msqrt': {
                const contentChildren = Array.from(node.children);
                const groupNode = walkGroup(contentChildren, depth);
                const operatorNode = { name: wrapInMathTag('<msqrt></msqrt>'), color: listColors[depth % 5], value: 10 + Math.random() * 20 };
                return { name: wrapInMathTag(node.outerHTML), color: listColors[depth % 5], children: [operatorNode, groupNode].filter(Boolean) };
            }
            case 'mrow':
            case 'math': {
                const children = Array.from(node.children);
                let groups = [], currentGroup = [];

                for (let child of children) {
                    const content = child.textContent.trim();
                    const isOp = child.tagName === 'mo' && ['=', '+', '-', '*', '/', '^'].includes(content);
                    if (isOp) {
                        if (currentGroup.length) groups.push(currentGroup);
                        groups.push([child]);
                        currentGroup = [];
                    } else {
                        currentGroup.push(child);
                    }
                }
                if (currentGroup.length) groups.push(currentGroup);

                if (groups.length === 1) {
                    return walkGroup(groups[0], depth);
                } else {
                    return {
                        name: wrapInMathTag(node.outerHTML),
                        color: listColors[depth % 5],
                        children: groups.map(group => walkGroup(group, depth)).filter(Boolean)
                    };
                }
            }
            default: {
                const defaultChildren = Array.from(node.children)
                    .map(child => walk(child, depth))
                    .filter(Boolean);
                return {
                    name: wrapInMathTag(node.outerHTML),
                    color: listColors[(depth-1) % 5],
                    children: defaultChildren.length ? defaultChildren : undefined,
                    value: defaultChildren.length === 0 ? 10 + Math.random() * 20 : undefined,
                };
            }
        }
        return null;
    }

    function walkGroup(nodes, depth) {
        if (Array.isArray(nodes) && nodes.length === 1) {
            return walk(nodes[0], depth);
        }
        const groupHTML = nodes.map(n => n.outerHTML).join('');
        const children = nodes
            .map(n => walk(n, depth))
            .filter(Boolean);
        return {
            name: wrapInMathTag(groupHTML),
            color: listColors[depth % 5],
            children: children.length ? children : undefined
        };
    }

    const parsedChildren = Array.from(xml.documentElement.children)
        .map(child => walk(child, 0))
        .filter(Boolean);

    if (parsedChildren.length === 1) {
        return parsedChildren[0];
    }

    return { name: wrapInMathTag(mathml), color: listColors[depth % 5], children: parsedChildren };
}