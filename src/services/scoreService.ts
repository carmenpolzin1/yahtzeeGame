'use server';

const url = 'http://localhost:3000/api';

/** 
 *  retrieves ALL scores from the database (Past_Scores) and stores them in an Score[] - each has properties Game_Num, Player_Name, and Score
 *  returns an empty [] if error is thrown
 */
// eslint-disable-next-line
export async function getAllScores() {
  const response = await fetch(`${url}/getAllScores`, {
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error("Error: " + response.status);
  }

  return await response.json() as IScore[];
}

/** 
*  Adds a score to the database (Past_Scores) as a Score object - has Game_Num, Player_Name, and Score
*   @param name - player's name to add in the format of a string
*   @param score - player's score to add to the database in format of a number
*   returns null if error is thrown
 **/
// eslint-disable-next-line
export async function addScore(name: string, score: number) {
  const response = await fetch(`${url}/addScore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, score })
  });

  if (!response.ok) {
    console.log("Error: ", response.status);
    return null;
  }

  return await response.json() as IScore;
}

/**
 *  Deletes all scores in the database (Past_Scores)
 */
// eslint-disable-next-line
export async function clearScores() {
  const response = await fetch(`${url}/clearScores`, {
    method: 'DELETE'
  });
  return response.json();
}

/* 
 * Describes Score interface - has the same properties as the database (Game_Num, Player_Name, and Score)
 */
export interface IScore {
  Id: number;
  Player_Name: string;
  Score: number;
}