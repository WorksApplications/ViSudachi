import React, { useEffect, useState } from 'react';
import LeaderLine from 'react-leader-line';
import axios from 'axios';
import viterbi from './Lattice';
import locateMorpheme from './Layout';
import MorphemeBox from './MorphemeBox';

function useLines(bestEdges, refs) {
  useEffect(() => {
    const lines = bestEdges.map((e) => (
      new LeaderLine(refs[e.start].current, refs[e.end].current,
        {
          path: 'straight',
          color: 'gray',
          middleLabel: String(e.connectCost),
          startPlug: 'behind',
          endPlug: 'behind',
          startSocket: 'right',
          endSocket: 'left',
        })
    ));
    return (() => lines.forEach(l => l.remove()));
  });
}

function areOverlapping(a, b) {
  if (a.begin === null || a.end === null || b.begin === null || b.end === null) {
    return false;
  } else if (b.begin < a.begin) {
    return b.end > a.begin;
  } else {
    return b.begin < a.end;
  }
}

function pruneMorphemes(morphemes, selectedNids) {
  const newMorphemes = [...morphemes];
  for (const nid of selectedNids) {
    const selected = morphemes[nid];
    newMorphemes.forEach((m, id) => {
      if (id !== nid && areOverlapping(selected, m)) {
        newMorphemes[id] = {...m, cost: Infinity};
      }
    });
  }
  return newMorphemes;
}

function selectNode(nodeId, morphemes, selectedNodes) {
  const newSelectedNodes = new Set(selectedNodes);
  const node = morphemes[nodeId];
  for (const nid of selectedNodes) {
    const m = morphemes[nid];
    if (areOverlapping(node, m)) {
      newSelectedNodes.delete(nid);
    }
  }
  newSelectedNodes.add(nodeId);
  return newSelectedNodes;
}

async function setLattice(text, setMorpheme) {
  if (text) {
    try {
      const response = await axios({
        method: 'post',
        url: '/dump',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: {
          text: text
        }
      });
      setMorpheme(response.data.lattice);
    } catch (error) {
      console.log(error);
    }
  } else {
    setMorpheme([]);
  }
}

function App() {
  const [morphemes, setMorpheme] = useState([]);
  
  const [bestCost, bestPath, bestEdges] = viterbi(morphemes);

  const layouts = locateMorpheme(morphemes);
  const refs = morphemes.map(e => React.createRef());
  useLines(bestEdges, refs);

  const [selectedNids, setSelectedNode] = useState(new Set());

  function handleClick(nodeId) {
    if (!selectedNids.has(nodeId)) {
      setSelectedNode(selectNode(nodeId, morphemes, selectedNids));
    }
  }
  
  const prunedMorphemes = pruneMorphemes(morphemes, selectedNids);
  const [totalCost, selectedPath, selectedEdges] = viterbi(prunedMorphemes);
  useLines(selectedEdges, refs);

  let costDiff = '';
  if (totalCost !== bestCost) {
    costDiff = `(${new Intl.NumberFormat('ja-JP', {signDisplay: 'always'}).format(totalCost - bestCost)})`;
  }

  const [scale, setScale] = useState(100);

  const latticeItems = morphemes.map((m, i) =>
    <MorphemeBox
      key={i}
      ref={refs[i]}
      selected={selectedPath.includes(i)}
      best={bestPath.includes(i) && !selectedPath.includes(i)}
      morpheme={m}
      onClick={() => handleClick(i)}
      {...layouts[m.nodeId]}
    />);

  return (
    <div className="App">
      <div className="pannel">
        <label for="input">Input: </label>
        <input
          id="input"
          type="text"
          onChange={e => setLattice(e.target.value, setMorpheme)}
        />
        <div className="totalCost">
          <p>Total Cost: {totalCost} {costDiff}</p>
        </div>
      </div>
      <input
        type="range"
        id="font-scale"
        name="lattice scale"
        min="5"
        max="100"
        value={scale}
        onChange={e => setScale(e.target.value)}
      />
      <div id="lattice" style={{fontSize: scale + '%'}}>
        {latticeItems}
      </div>
    </div>
  );
}

export default App;
