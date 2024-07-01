import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [bombClicked, setBombClicked] = useState(false);
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseInt(savedBalance, 10) : 0; // Parse to integer
  });
  const [roundBalance, setRoundBalance] = useState(0);
  const[bombId, setBombId] = useState("x-y");
  const [numberSelected, setNumberSelected] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const size = 5;

  useEffect(() => {
    console.log('Saving balance to localStorage:', balance);
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  const startRound= ()=>{
    const x=Math.floor(Math.random() * size);
    const y=Math.floor(Math.random() * size);
    setBombId(prevId => prevId = x+'-'+y);
    setRoundStarted(true);
    setBalance(prevBalance => prevBalance - 1);
  }
  const cellClick = (i, j) => {
    if(roundStarted){
    const cellId = `${i}-${j}`;
    const isBomb = cellId === bombId;

    if (bombClicked) {
      return;
    }
    setSelectedCells(prevSelectedCells => {
      const newSelectedCells = new Set(prevSelectedCells);

      if (!newSelectedCells.has(cellId)) {
        newSelectedCells.add(cellId);
        setNumberSelected(prevNumberSelected => prevNumberSelected + 1);
        
        if (isBomb) {
          setRoundBalance(0);
          setBombClicked(true);
        } else {
          setRoundBalance(prevRoundBalance => prevRoundBalance + 1);
        }
      }

      return newSelectedCells;
    });
  }else{
    return;
  }
  }

  const endRound = () => {
    setBalance(prevBalance => prevBalance + roundBalance);
    setRoundBalance(0);
    setBombClicked(false);
    setSelectedCells(new Set());
    setNumberSelected(0);
    setRoundStarted(false);
  }

  const createTable = () => {
    const table = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const cellId = `${i}-${j}`;
        const isSelected = selectedCells.has(cellId);
        row.push(
          <td
            key={cellId}
            className={isSelected ? (cellId === bombId ? 'danger' : 'selected') : ''}
            onClick={() => cellClick(i, j)}
          >
            {cellId}
          </td>
        );
      }
      table.push(<tr key={i}>{row}</tr>);
    }
    return table;
  };

  return (
    <div>
      <h1>Your balance: ${balance}</h1>
      <h1>This round winnings: ${roundBalance}</h1>
      <p>Number of selected cells: {numberSelected}</p>
      <button onClick={startRound} className={roundStarted ?'started' : ''}>Start</button>
      <table className={bombClicked ? 'bombed' : ''}>
        <tbody>{createTable()}</tbody>
      </table>
      <button onClick={endRound}>{bombClicked ? 'Try again?' : 'End round early'}</button>
    </div>
  );
}

export default App;
