import {useEffect, useState} from "react";
import {
  IOnlinePlayer,
  createGameRoom,
  getAllPlayers,
  joinGameRoom,
  endGame,
  removePlayer,
  startGame
} from "@/services/onlineGameService";
import OnlinePlayerList from "@/app/components/onlinePlayerList";
import { useUser } from '@/services/userContext';

type OnlineCardProps = {
  startOnlineYahtzee: (players: IOnlinePlayer[], gameId: string, curPlayerId: number) => void;
}

export const OnlineCard = ({ startOnlineYahtzee } : OnlineCardProps) => {
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const [gameIdInput, setGameIdInput] = useState<string>("");
  const [gameRoomId, setGameRoomId] = useState<string>("");
  const [gameJoined, setGameJoined] = useState<boolean>(false);
  const [players, setPlayers] = useState<IOnlinePlayer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [curPlayerid, setCurPlayerid] = useState<number>(0);
  const { user } = useUser(); 

  /**
   * Sets the player name to the user's username if it exists.
   */
  useEffect(() => {
    if (user && user.username) {
      setPlayerNameInput(user.username);
    }
  }, [user]);

  /**
   * Gets all players in the game room when the game is joined.
   */
  useEffect(() => {
    if (gameJoined) {
      updatePlayers();
    }
  }, [gameJoined]);

  /**
   * Creates a game room with the player's name.
   */
  const createGame = () => {
    if (playerNameInput.trim() == "") {
      setErrorMessage("Please enter your name")
      return;
    }
    createGameRoom(playerNameInput).then((ids) => {
      setGameRoomId(ids.roomId);
      setGameJoined(true);
      setIsHost(true);
      setCurPlayerid(ids.playerId);
    }).catch(() => {
      setErrorMessage("Error creating game room");
    })
  }

  /**
   * Joins a game room with the given game ID and player name.
   */
  const joinGame = () => {
    if (gameIdInput.trim() == "" || playerNameInput.trim() == "") {
      setErrorMessage("Please enter your name and game ID")
      return;
    }
    joinGameRoom(gameIdInput, playerNameInput).then((ids) => {
      setGameRoomId(ids.roomId);
      setGameJoined(true);
      setIsHost(false);
      setCurPlayerid(ids.playerId);
    }).catch(() => {
      setErrorMessage("Game room does not exist or is full");
    })
  }

  /**
   * Updates the players in the game room.
   */
  const updatePlayers = () => {
    getAllPlayers(gameRoomId).then((players) => {
      if (!players.some((player) => player.id == curPlayerid)) {
        onBoot();
        return;
      }
      setPlayers(players);
    }).catch((error) => {
      console.error("Error getting players", error);
    })
  }

  /**
   * Quits the game room and resets the state.
   */
  const onQuit = () => {
    if (isHost) {
      endGame(gameRoomId).catch((error) => {
        console.error("Error ending game", error);
      });
    } else {
      removePlayer(gameRoomId, curPlayerid).catch((error) => {
        console.error("Error removing player", error);
      });
    }
    resetStates();
  }

  const onBoot = () => {
    resetStates();
    setErrorMessage("You were removed from the game, or the host ended the game!");
  }

  const resetStates = () => {
    setGameJoined(false);
    setGameIdInput("");
    setGameRoomId("");
    setPlayers([]);
    setIsHost(false);
    setIsReady(false);
    setCurPlayerid(0);
    setErrorMessage("");
  }

  const startGameHost = () => {
    startGame(gameRoomId).catch((error) => {
      console.error("Error starting game", error);
    });
  }

  /**
   * Toggles the ready status of the player.
   */
  const toggleReadyStatus = () => {
    setIsReady(!isReady);
  };

  return (
    <div className={"flex flex-col h-full w-full"}>
      {!gameJoined && <div className={"flex flex-col h-full w-full items-center justify-center gap-2"}>
        {!user&&
          <input
            className={`border-b-[1px] text-xl ${playerNameInput.trim() == "" ? "border-app-red" : "border-app-gray"} outline-0 text-center w-40 bg-transparent`}
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            placeholder={"Your Name"}
          />
        }
        {user && <div
          className={`text-xl font-bold ${playerNameInput.trim() === "" ? "text-red-500" : "text-gray-800"} text-center w-40 mb-4`}>
          {playerNameInput || "Your Name"}
        </div>
        }
        <input
          className={`border-b-[1px] text-xl ${gameIdInput.trim() == "" ? "border-app-red" : "border-app-gray"} outline-0 text-center w-40 bg-transparent`}
          value={gameIdInput}
          onChange={(e) => setGameIdInput(e.target.value)}
          placeholder={"Enter Game ID"}
        />
        <div className="flex justify-center items-center mt-10"> 
          <button
            className="bg-app-yellow text-app-gray px-2 py-1 rounded-xl mx-1 w-40 border transition hover:scale-105 shadow"
            onClick={createGame}>
            CREATE A GAME
          </button>
          <button
            className={`bg-app-yellow text-app-gray px-2 py-1 rounded-xl mx-1 w-40 border transition hover:scale-105 shadow ${gameIdInput.trim() === "" ? 'bg-gray-300 text-gray-500' : ''}`}
            onClick={joinGame}
            disabled={gameIdInput.trim() === ""}>
            JOIN A GAME
          </button>
        </div>
        <div className={"text-xs text-app-red"}>
          {errorMessage}
        </div>
      </div>}
      {gameJoined &&
        <div className={"flex flex-col w-full h-full items-center justify-between"}>
          <div className={"flex flex-col items-center w-full"}>
            <div className="text-xl font-bold">
              {gameRoomId}
            </div>
            {gameRoomId!="" &&
              <OnlinePlayerList players={players} gameRoomId={gameRoomId} updatePlayers={updatePlayers} isHost={isHost} startOnlineYahtzee={startOnlineYahtzee} currentPlayerId={curPlayerid}/>
            }
          </div>
          <div className={`flex justify-center items-center`}>
            {isHost ? (
              <button className="bg-app-yellow text-app-gray text-xl px-2 py-1 rounded-xl mx-1 w-40 border transition hover:scale-105 shadow" onClick={startGameHost}>
                START GAME
              </button>
            ) : (
              <button
                className={`text-app-gray text-xl px-2 py-1 rounded-xl mx-1 w-40 border transition hover:scale-105 shadow ${!isReady ? 'bg-green-500' : 'bg-app-red'}`}
                onClick={toggleReadyStatus}
              >
                {isReady ? "UNREADY" : "READY"}
              </button>
            )}
            <button className="bg-app-red text-app-gray text-xl px-2 py-1 rounded-xl mx-1 w-40 border transition hover:scale-105 shadow" onClick={onQuit}>
              QUIT
            </button>
          </div>
        </div>
      }
    </div>
  );
}