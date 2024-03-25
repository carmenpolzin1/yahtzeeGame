'use client';
import GameModeCard from './gameModeCard'
import YahtzeeGame from './yahtzeeGame'
import React, {useEffect, useState} from "react";
import {GameStatus as GS} from "@/models/enums";
import {Player} from "@/models/player";
import { getAllScores, addScore, clearScores } from "@/services/scoreService";
import EndPageCard from './endPageCard';
import Nav from "@/app/components/nav";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GS>(GS.AddPlayers);
  const [players, setPlayers] = useState<Player[]>([]);

  // Temporary code to test the score service.
  useEffect(() => {
    console.log('Testing score service');
    // getAllScores().then((scores) => {
    //   console.log(scores);
    // });
    // clearScores().then((response) => {
    //   console.log(response);
    // });
    // getAllScores().then((scores) => {
    //   console.log(scores);
    // });
    // addScore('test', 200).then(() => {});
    // addScore('test2', 300).then(() => {});
    getAllScores().then((scores) => {
      console.log(scores);
    });
  }, []);

  /**
   * Starts the game with the given players and number of players.
   * @param playerNames
   * @param numPlayers
   */
  const startGame = (playerNames : string[], numPlayers : number) => {
    let newPlayers = [];
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push(new Player(playerNames[i]));
    }
    setPlayers(newPlayers);
    setGameStatus(GS.InProgress);
  }

  /**
   * sets the game status to EndGame
   * then adds the total score of each player to their scorecard
   */
  const endGame = () => {
    setGameStatus(GS.EndGame);
    for (let player of players) {
      addScore(player.name, player.scorecard.totalScore).then(() => {});
    }
  }

  /**
   * Changes the players in the game.
   */
  const changePlayers = () => {
    setGameStatus(GS.AddPlayers);
  }

  /**
   * Restarts the game.
   */
  const restartGame = () => {
    setPlayers([]);
    setGameStatus(GS.AddPlayers);
  }

  return (
    <div className="flex flex-col h-screen bg-app-red" style={{ minWidth: '1162px' }}>
      <Nav/>
      {gameStatus == GS.AddPlayers &&  <GameModeCard startYahtzee={startGame} currentPlayers={players}/>}
      {gameStatus == GS.InProgress && <YahtzeeGame changePlayers={changePlayers} players={players} endGame={endGame}/>}
      {gameStatus === GS.EndGame && <EndPageCard players={players} onRestart={restartGame} />}
    </div>
  );
}
