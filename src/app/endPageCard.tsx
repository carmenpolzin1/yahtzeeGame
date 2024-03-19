import React, {useEffect, useState} from "react";
import { RxCross1 } from "react-icons/rx";
import { Baloo_2 } from "next/font/google";
import {Player} from "@/models/player";
import { getAllScores, addScore, clearScores} from "@/services/scoreService";
import { Score } from "@/services/scoreService"; 

// font that we use for titles (not cell text)
const baloo2 = Baloo_2({ subsets: ["latin"] });

type EndPageCardProps = {
  players: Player[];
  onRestart: () => void;
}

const EndPageCard = ({players, onRestart} : EndPageCardProps) => {
  // declares the current players as a list of player objects who each have name and score property
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  // declares leaderboard scores as a list of player object which each have a Game_Num. Player_Name, and Score property
  const [leaderboardScores, setLeaderboardScores] = useState<Score[]>([]);
  const [recentGameNum, setRecentGameNum] = useState(0);



  useEffect(() => {
    let curPlayers = [...players];
    // lists the current players in order depending on their score
    setCurrentPlayers(curPlayers.sort((a, b) => b.scorecard.totalScore - a.scorecard.totalScore));
    // gets ALL of the scores from database then getst the top 10 to show on the leaderboard
    getAllScores().then((scores: Score[]) => { 
      let sortedScores = scores.sort((a, b) => b.Score - a.Score);
      setLeaderboardScores(sortedScores.slice(0,10));
    });
    //want to get the most recent game number (the greatest game number is going to be the largest)
    getAllScores().then((scores: Score[]) => { 
      let largestNums = scores.sort((a, b) => b.Game_Num - a.Game_Num);
      let firstLargestNum = largestNums.slice(0,1)
      setRecentGameNum(firstLargestNum[0].Game_Num);
    });
  }, [players]);


  // scorecard 
  return (
    <div className="flex h-full w-full justify-center items-center mb-40">
      <div className="flex flex-col p-4 w-96 rounded-xl bg-white text-black shadow-2xl relative">
        {/*<button className="absolute top-0 right-0 m-2" onClick={onRestart}>*/}
        {/*  <RxCross1 className="text-2xl" />*/}
        {/*</button>*/}


        {/* final score part of scorecard */}
        <div className={"text-2xl text-center"}>
          Final Score
        </div>
        <div className={`flex flex-col items-center w-full py-4 ${baloo2.className}`}>
          {currentPlayers.map((player, index) => (
            <div key={index} className="text-xl flex w-[80%] border-b">
              <div className={"text-left w-[50%]"}>
                {player.name}
              </div>
              <div className={"text-right w-[50%]"}>
                {player.scorecard.totalScore}
              </div>
            </div>
          ))}
        </div>


        {/* leaderboard party of scorecard - only displays if connected to the database 
            if player makes it only the leaderboard - their name is highlighted */}
        {leaderboardScores?.length !== 0 && (
          <div>
            <div className={"text-2xl text-center"}>
              Leaderboard
            </div>
            <div className={`flex flex-col items-center w-full py-4 ${baloo2.className}`}>
              {leaderboardScores.map((entry, index) => (
                <div
                  key={index}
                  className={`text-xl flex w-[80%] border-b ${
                    currentPlayers.some((player) => ((player.name === entry.Player_Name) && (recentGameNum == entry.Game_Num))) ? 'font-bold' : ''
                  }`}
                >
                  <div className={"text-left w-[50%]"}>
                    {entry.Player_Name}
                  </div>
                  <div className={"text-right w-[50%]"}>
                    {entry.Score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* restart game button at bottom of the scorecard */}
        <div className={`flex justify-center items-center ${baloo2.className}`}>
          <button className="bg-app-yellow text-app-gray text-xl px-2 py-1 rounded-xl mx-1 w-48 border transition hover:scale-105 shadow" onClick={onRestart}>
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndPageCard;
