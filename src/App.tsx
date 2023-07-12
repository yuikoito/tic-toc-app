import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [cells, setCells] = useState<number[][]>(
    new Array(3).fill("").map((_) => new Array(3).fill(0))
  );
  const [isYourTurn, setIsYourTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<"you" | "machine" | null>(null);
  // 1... your turn
  // 2... machine turn
  const onCellClickHandler = (row: number, col: number) => {
    const copiedCells = [...cells];
    if (isYourTurn) {
      copiedCells[row][col] = 1;
      setCells(copiedCells);
      setIsYourTurn(false);
    }
  };
  const judge = () => {
    // check row
    for (let row = 0; row < cells.length; row++) {
      const cellNumber = cells[row][0];
      if (cellNumber === 0) continue;
      if (cells[row][1] === cellNumber && cells[row][2] === cellNumber) {
        setWinner(cellNumber === 1 ? "you" : "machine");
        return;
      }
    }
    // check column
    for (let col = 0; col < cells[0].length; col++) {
      const cellNumber = cells[0][col];
      if (cellNumber === 0) continue;
      if (cells[1][col] === cellNumber && cells[2][col] === cellNumber) {
        setWinner(cellNumber === 1 ? "you" : "machine");
        return;
      }
    }
    // check diagonals
    if (cells[0][0] === cells[1][1] && cells[0][0] === cells[2][2]) {
      if (cells[0][0] === 0) return;
      setWinner(cells[0][0] === 1 ? "you" : "machine");
      return;
    }
    if (cells[0][2] === cells[1][1] && cells[0][2] === cells[2][0]) {
      if (cells[0][2] === 0) return;
      setWinner(cells[0][2] === 1 ? "you" : "machine");
      return;
    }
  };
  const onUpdateCellByMachine = () => {
    // Find indexes of cells that are 0
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        if (cells[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // If there are no empty cells, just return
    if (emptyCells.length === 0) return;

    // Select one randomly
    const selectedCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Update the selected cell
    const copiedCells = [...cells];
    copiedCells[selectedCell.row][selectedCell.col] = 2;
    setCells(copiedCells);
    setIsYourTurn(true);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isYourTurn && !winner) {
      timeoutId = setTimeout(() => {
        onUpdateCellByMachine();
        setIsYourTurn(true);
      }, 1000);
    }
    judge();
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [isYourTurn, winner]);
  useEffect(() => {
    if (winner) {
      window.alert(winner === "you" ? "You are winner!" : "You are beaten!");
    }
  }, [winner]);

  return (
    <div className="container">
      <div className="text">
        {isYourTurn ? "It's your turn" : "It's machine's turn"}
      </div>
      <div className="row">
        {cells.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="col">
              {row.map((col, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    className={`${!isYourTurn ? "disabled " : ""}cell`}
                    onClick={() => onCellClickHandler(rowIndex, colIndex)}
                  >
                    {col === 1 ? "○" : col === 2 ? "×" : ""}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
