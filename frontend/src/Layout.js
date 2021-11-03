const X_GRID = 15;
const Y_GRID = 10;
const SPACING = 5;
const UNIT = "em";

function getUnoccupiedLevel(begin, end, isOccupied) {
    for (let level = 0; ; level++) {
        if (isOccupied.slice(begin, end).every(o => !o[level])) {
            return level;
        }
    }
}

function locateMorpheme(morphemes) {
    const positions = [...new Set(morphemes.map(m => m.begin))];
    const isOccupied = [...Array(positions.length)].map(() => [false]);

    const layouts = [];

    positions.forEach((begin, leftPosition) => {
        morphemes.filter(m => m.begin === begin)
            .sort((a, b) => (b.end - b.begin) - (a.end - a.begin))
            .forEach(m => {
                const rightPosition = positions.indexOf(m.end);
                const left = leftPosition * X_GRID;
                const width = (rightPosition - leftPosition) * X_GRID - SPACING;
        
                const level = getUnoccupiedLevel(leftPosition, rightPosition, isOccupied);
                const top = level * Y_GRID;
                for (let i = leftPosition; i < rightPosition; i++) {
                    isOccupied[i][level] = true;
                }

                layouts[m.nodeId] = {left: left + UNIT, top: top + UNIT, width: width + UNIT};
            });
    });

    return layouts;
}

export default locateMorpheme;
