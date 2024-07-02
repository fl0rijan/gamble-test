import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [bombClicked, setBombClicked] = useState(false);
  const [message, setMessage] = useState("$5 to play");
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseInt(savedBalance, 10) : 0;
  });
  const [allTimeHistory, setAllTimeHistory] = useState(() => {
    const savedHistory = JSON.parse(localStorage.getItem('allTimeHistory'));
    return savedHistory || [];
  });
  const [roundBalance, setRoundBalance] = useState(0);
  const [bombId, setBombId] = useState("x-y");
  const [numberSelected, setNumberSelected] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const [deposit, setDeposit] = useState('');
  const size = 5;

  useEffect(() => {
    console.log('Saving balance to localStorage:', balance);
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    console.log('Saving history to localStorage:', allTimeHistory);
    localStorage.setItem('allTimeHistory', JSON.stringify(allTimeHistory));
  }, [allTimeHistory]);

  const startRound = () => {
    if (balance < 5) {
      setMessage("Not enough balance. Add balance");
    } else {
      setMessage("$5 to play");
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      setBombId(`${x}-${y}`);
      setRoundStarted(true);
      setBalance(prevBalance => prevBalance - 5);
    }
  };

  const cellClick = (i, j) => {
    if (roundStarted) {
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
    } else {
      return;
    }
  };

  const endRound = () => {
    const finalBalance = balance + roundBalance;
    setBalance(finalBalance);
    setRoundBalance(0);
    setBombClicked(false);
    setSelectedCells(new Set());
    setNumberSelected(0);
    setRoundStarted(false);

    setAllTimeHistory(prevHistory => [
      ...prevHistory,
      { balance: finalBalance, winnings: roundBalance }
    ]);
  };

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

  const addBalance = () => {
    const depositAmount = parseInt(deposit, 10);
    if (!isNaN(depositAmount)) {
      setBalance(prevBalance => prevBalance + depositAmount);
      setDeposit('');
    }
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter money amount"
        value={deposit}
        onChange={(e) => setDeposit(e.target.value)}
      />
      <button onClick={addBalance}>Add balance to your account</button>
      <h1>Your balance: ${balance}</h1>
      <h1>This round winnings: ${roundBalance}</h1>
      <p>Number of selected cells: {numberSelected}</p>
      <p>{message}</p>
      <table className={bombClicked ? 'bombed' : ''}>
        <tbody>{createTable()}</tbody>
      </table>
      <button onClick={endRound}>{bombClicked ? 'Try again?' : 'End round early'}</button>
      <button onClick={startRound} className={roundStarted ? 'started' : ''}>Start</button>
      <h4>History</h4>
      <ul>
        {allTimeHistory.map((entry, index) => (
          <li key={index} className="list">
            <p className="number-task">{index + 1}. Balance: ${entry.balance}, Winnings: ${entry.winnings}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
