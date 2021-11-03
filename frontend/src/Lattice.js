function getMinimumEdges(morphemes) {
    const minimumEdges = new Array(morphemes.length);

    const bos = morphemes.find(m => m.begin === null);
    minimumEdges[bos.nodeId] = {totalCost: 0, connectCost: null, previousNodeId: null};

    const positions =  [...new Set(morphemes.map(m => m.end).filter(i => i !== null))];
    for (const begin of positions) {
        for (const rNode of morphemes.filter(m => m.begin === begin)) {
            let totalCost = Infinity;
            let previousNodeId = null;
            let bestConnectCost = 0;
            const lNodes = morphemes.filter(m => m.end === begin);
            for (let i = 0; i < lNodes.length; i++) {
                const lNode = lNodes[i];
                const connectCost = rNode.connectCosts[i];
                const cost = minimumEdges[lNode.nodeId].totalCost + connectCost;
                if (cost < totalCost) {
                    totalCost = cost;
                    previousNodeId = lNode.nodeId;
                    bestConnectCost = connectCost;
                }
            }
            totalCost += rNode.cost;
            minimumEdges[rNode.nodeId] = {totalCost: totalCost, connectCost: bestConnectCost, previousNodeId: previousNodeId};
        }
    }

    return minimumEdges;
}

function viterbi(morphemes) {
    if (morphemes.length === 0) {
        return [0, [], []]
    }
    const minimumEdges = getMinimumEdges(morphemes);
    const eos = morphemes.find(m => m.end === null);

    const bestPath = [];
    for (let nodeId = eos.nodeId; nodeId !== null; nodeId = minimumEdges[nodeId].previousNodeId) {
        bestPath.unshift(nodeId);
    }

    const bestEdges = [];
    for (let i = 1; i < bestPath.length; i++) {
        const start = bestPath[i - 1];
        const end = bestPath[i];
        const connectCost = minimumEdges[end].connectCost;
        bestEdges.push({start: start, end: end, connectCost: connectCost});
    }

    return [minimumEdges[eos.nodeId].totalCost, bestPath, bestEdges];
}

export default viterbi;