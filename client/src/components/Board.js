import Square from "./Square";

const Board = ({
  socket,
  isPlayerX_nextMove,
  currentSquares,
  selectedPlayer,
}) => {
  let winLine = null;
  let classN = "";

  const findOutWinline = (line) => {
    let className = "strike";

    switch (line) {
      case 0:
        className = "strike strike-row-1";
        break;
      case 1:
        className = "strike strike-row-2";
        break;
      case 2:
        className = "strike strike-row-3";
        break;
      case 3:
        className = "strike strike-column-1";
        break;
      case 4:
        className = "strike strike-column-2";
        break;
      case 5:
        className = "strike strike-column-3";
        break;
      case 6:
        className = "strike strike-diagonal-1";
        break;

      default:
        className = "strike strike-diagonal-2";
    }
    return className;
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        winLine = i;
        console.log(winLine);
        classN = findOutWinline(winLine);

        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (currentSquares[i] || calculateWinner(currentSquares)) {
      return;
    }
    const nextSquares = currentSquares.slice();
    if (selectedPlayer === "x" && isPlayerX_nextMove) {
      nextSquares[i] = "X";
    } else if (selectedPlayer === "x" && !isPlayerX_nextMove) {
      alert("Now is not your turn");
      return;
    } else if (selectedPlayer === "o" && !isPlayerX_nextMove) {
      nextSquares[i] = "0";
    } else if (selectedPlayer === "o" && isPlayerX_nextMove) {
      alert("Now is not your turn");
      return;
    }
    const nextTurn = !isPlayerX_nextMove;

    socket.emit("playerMoved", { nextSquares, nextTurn });
  };

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = `${winner} WON`;
  } else if (
    currentSquares.every((square) => square !== null && square !== undefined)
  ) {
    status = "It is draw";
  } else {
    status = "Next player: " + (isPlayerX_nextMove ? "X" : "0");
  }

  const renderSquare = (elem, num) => {
    return (
      <Square
        value={elem}
        numSquare={num}
        onSquareClick={() => handleClick(num)}
      />
    );
  };

  return (
    <>
      <h2>{status}</h2>
      <p style={{ marginBottom: 50 }}>You play for: {selectedPlayer}</p>

      <div className="board">
        {renderSquare(currentSquares[0], 0)}
        {renderSquare(currentSquares[1], 1)}
        {renderSquare(currentSquares[2], 2)}
        {renderSquare(currentSquares[3], 3)}
        {renderSquare(currentSquares[4], 4)}
        {renderSquare(currentSquares[5], 5)}
        {renderSquare(currentSquares[6], 6)}
        {renderSquare(currentSquares[7], 7)}
        {renderSquare(currentSquares[8], 8)}
        <div className={classN}> </div>
      </div>
    </>
  );
};

export default Board;
