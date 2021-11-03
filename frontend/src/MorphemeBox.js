import React from "react";

function splitPos(pos) {
    const posList = pos.split(',');
    return [posList.slice(0,4).join(','), posList.slice(4).join(',')];
}

const MorphemeBox = React.forwardRef((props, ref) => {
    const {left, top, width, selected, best, morpheme, onClick} = props;
    const [pos, inflection] = splitPos(morpheme.pos);
    let className = "morphbox";
    if (selected) {
        className += " selected";
    } else if (best) {
        className += " best";
    }
    return (
        <div className={className} ref={ref} onClick={onClick} style={{left, top, width}}>
            {morpheme.headword}
            <br />
            ID: {morpheme.wordId}
            <br />
            {pos}
            <br />
            {inflection}
            <br />
            {morpheme.cost}
        </div>
    );
});

export default MorphemeBox;