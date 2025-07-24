import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * A single square in the Tic Tac Toe grid.
 * @param {object} props - React props.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " ttt-highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      tabIndex="0"
      type="button"
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main Tic Tac Toe app, handles grid, state, win/tie detection, and UX.
 */
function App() {
  // Game state: 3x3 board, 'X' starts.
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [isTie, setIsTie] = useState(false);

  // Calculate winner/tie whenever board updates.
  useEffect(() => {
    const result = calculateWinner(board);
    setWinnerInfo(result);
    const hasTie = !result.winner && board.every(Boolean);
    setIsTie(hasTie);
  }, [board]);

  // Handler: user clicks on a square.
  function handleClick(idx) {
    if (winnerInfo.winner || board[idx]) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // Handler: restart the game.
  // PUBLIC_INTERFACE
  function restartGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
    setIsTie(false);
  }

  // Status message for user.
  let status;
  if (winnerInfo.winner) {
    status = (
      <span className="ttt-announce" style={{ color: "var(--accent)" }}>
        Player <b>{winnerInfo.winner}</b> wins!
      </span>
    );
  } else if (isTie) {
    status = (
      <span className="ttt-announce" style={{ color: "var(--secondary)" }}>
        It's a tie!
      </span>
    );
  } else {
    status = (
      <span>
        <span className="ttt-turn-label">Turn:</span> 
        <span className="ttt-turn" style={{ color: xIsNext ? "var(--primary)" : "var(--secondary)" }}>
          Player {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  // 3x3 grid generation.
  function renderGrid() {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
        {[0, 1, 2].map(row => (
          <div className="ttt-row" key={row} role="row">
            {[0, 1, 2].map(col => {
              const idx = row * 3 + col;
              const isHighlight =
                winnerInfo.line && winnerInfo.line.includes(idx);
              return (
                <Square
                  key={idx}
                  value={board[idx]}
                  onClick={() => handleClick(idx)}
                  highlight={isHighlight}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // The main app layout.
  return (
    <div className="tic-tac-toe-root">
      <main className="ttt-container">
        <h1 className="ttt-title">
          <span style={{ color: "var(--accent)" }}>Tic</span>
          <span style={{ color: "var(--primary)" }}>Tac</span>
          <span style={{ color: "var(--secondary)" }}>Toe</span>
        </h1>
        <div className="ttt-status" aria-live="polite">{status}</div>
        {renderGrid()}
        <button className="ttt-restart-btn" onClick={restartGame}>Restart Game</button>
      </main>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Determines if a player has won the game. Returns the winner and the winning line if found.
 * @param {Array} squares - current game board
 * @returns {{winner: ('X'|'O'|null), line: Array<number>|null}}
 */
function calculateWinner(squares) {
  // All possible winning lines
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

export default App;
