import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Board from "./components/Board";

function App() {
  const [players, setPlayers] = useState([]); //options before game start
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [anotherPlayerSelected, setAnotherPlayerSelected] = useState(null); //to disable option
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  const [isPlayerX_nextMove, setIsPlayerX_nextMove] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("playerOptions", (playerOptions) => {
      setPlayers(playerOptions); //sets with initial options
    });

    // listen for updates to the selected option
    newSocket.on("selectedOption", (data) => {
      if (!anotherPlayerSelected) {
        setAnotherPlayerSelected(data.option); //to disable option, little bug is still present (we can put both players "o")
      }
      //if anotherPlSel !== data.option
      if (newSocket.id === data.id) {
        setSelectedPlayer(data.option);
      }
    });

    newSocket.on("playerMoved", (data) => {
      setIsPlayerX_nextMove(data.nextTurn);
      setCurrentSquares(data.nextSquares);
    });

    // cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSelectOption = (event) => {
    const option = event.target.value;
    if (option) {
      socket.emit("selectedOption", { option, id: socket.id });
    }
  };

  const startGame = () => {
    if (!selectedPlayer) {
      alert("Select player");
      return;
    }
    setGameStarted(true);
    console.log("selectedPlayer: " + selectedPlayer?.value);
  };

  const restartGame = () => {
    setGameStarted(false);
    setSelectedPlayer(null);
    setAnotherPlayerSelected(null);
    setCurrentSquares(Array(9).fill(null));
  };

  return (
    <>
      {selectedPlayer && gameStarted ? (
        <div className="App">
          <div className="left-side">
            <Board
              socket={socket}
              isPlayerX_nextMove={isPlayerX_nextMove}
              currentSquares={currentSquares}
              selectedPlayer={selectedPlayer}
              setCurrentSquares={setCurrentSquares}
              setIsPlayerX_nextMove={setIsPlayerX_nextMove}
            />
          </div>

          <div className="right-side">
            <button onClick={restartGame}>Restart Game</button>
          </div>
        </div>
      ) : (
        <div className="select_section">
          <h3 className="select_h3">Select the player</h3>
          <select onChange={handleSelectOption}>
            {players.map((player) => (
              <option
                key={player}
                value={player}
                disabled={player === anotherPlayerSelected}
              >
                {player}
              </option>
            ))}
          </select>

          <button className="entry_button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}
    </>
  );
}

export default App;
