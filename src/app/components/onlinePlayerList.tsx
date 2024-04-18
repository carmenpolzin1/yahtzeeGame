import {pusherClient} from "@/services/pusher/pusherClient";
import {useEffect, useState} from "react";
import {getAllPlayers, IOnlinePlayer, removePlayer} from "@/services/onlineGameService";
import {RxCross1} from "react-icons/rx";

type OnlinePlayerListProps = {
  players: IOnlinePlayer[];
  gameRoomId: string;
  currentPlayerId: number;
  isHost: boolean;
  updatePlayers: () => void;
  startOnlineYahtzee: (players: IOnlinePlayer[], gameId: string, curPlayerId: number) => void;
}

const OnlinePlayerList = ({players, gameRoomId, updatePlayers, isHost, startOnlineYahtzee, currentPlayerId}: OnlinePlayerListProps) => {
  const [alert, setAlert] = useState<string>("");

  useEffect(() => {
    pusherClient.subscribe(gameRoomId);
    pusherClient.bind("player-joined", (playerName: string) => {
      setAlert(`${playerName} has joined the game!`);
      updatePlayers();
    });
    pusherClient.bind("player-removed", (playerName: string) => {
      setAlert(`${playerName} has left the game!`);
      updatePlayers();
    });
    pusherClient.bind("toggle-ready", () => {
      updatePlayers();
    });
    pusherClient.bind("game-started", () => {
      setAlert("Game is starting!");
      getAllPlayers(gameRoomId).then((players) => {
        setTimeout(() => {
          startOnlineYahtzee(players, gameRoomId, currentPlayerId);
        } , 3000);
      }).catch(() => {
        console.error("Error getting players");
        setAlert("Error starting game!")
      });
    });

    return () => {
      pusherClient.unsubscribe(gameRoomId);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAlert("");
    }, 5000);
  }, [alert]);

  const removePlayer2 = (playerId: number) => {
    removePlayer(gameRoomId, playerId).catch(() => {
      console.error("Error removing player");
    })
  }

  return(
    <div className={"flex flex-col w-full"}>
      {players.map((player, i) => {
        const showX = isHost && !player.isHost
        return (
          <div key={player.id}>
            <div className="flex justify-center items-center h-8 w-full gap-4">
              <label className="text-xl">
                Player {i + 1}:
              </label>

              {/* handles changing players by clicking the "x" button */}
              <div key={player.id} className={`text-center text-xl w-32 ${player.isReady ? 'text-green-600' : 'text-app-red'}`}>{player.name} {player.isHost && "(Host)"}</div>
              <button className={`${!showX && 'invisible'} hover:text-app-red`} onClick={() => {removePlayer2(player.id)}}>
                <RxCross1/>
              </button>
            </div>
          </div>
        // <div key={player.id} className="text-center text-xl w-32">{player.name} {player.isHost && "(Host)"}</div>
        )
        ;
      })}
      {alert != "" && <div className="text-center text-xs text-app-red">{alert}</div>}
    </div>
  )
}

export default OnlinePlayerList;