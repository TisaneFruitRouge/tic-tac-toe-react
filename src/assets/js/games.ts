import db from './firestore.js'
import { setDoc, addDoc, getDoc, updateDoc, collection, doc, onSnapshot } from 'firebase/firestore'

export type Game = {
  grid: Array<number>,
  name: string,
  nb_players: number,
  player_turn: number
}


/**
 * This function returns a game, which name was given as a parameter to this function
 * Returns null if the game doesn't exist
 */
async function getGameByName(name: string) {
  
  let data: Game = { // default values
    grid: [0,0,0,0,0,0,0,0,0],
    name: name,
    nb_players: 1,
    player_turn: 1
  };

  const gameRef = doc(db, "games", `game-${name}`);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    
    let _data = gameSnap.data()

    data.grid = _data.grid
    data.name = _data.name
    data.nb_players = _data.nb_players
    data.player_turn = _data.player_turn

    return data
  }
  else {
    return undefined
  }

}

/**
 * This function adds a game into the 'games' collection on the firestore
 */
async function addGame(game: Game) {

  let name = game.name

  let existingGame = await getGameByName(name)

  if (existingGame !== undefined) { // game with such name already exists
    return;
  } 

  let gameRef = doc(db, "games", `game-${name}`)

  try {
    await setDoc(gameRef, game);
    //console.log("Document written with ID: ", gameRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/**
 * This function replaces the grid and changes the player turn for a given game
 */
async function replaceGrid(grid: Array<Array<number>>, gameName:string, playerTurn:number) {

  const gameRef = doc(db, "games", `game-${gameName}`)

  let array1D: number[] = []

  grid.forEach((row:Array<number>)=>{
    array1D.push(row[0],row[1],row[2])
  })

  const res = await updateDoc(gameRef, {
    grid: array1D,
    player_turn: playerTurn
  });
}

/**
 * This function adds a player to a given game
 */
async function addPlayer(gameName: string, nb_players:number) {
  const gameRef = doc(db, "games", `game-${gameName}`)
  const res = await updateDoc(gameRef, {nb_players: nb_players});
}

/**
 * This function gets a firesotre game reference given a game name
 */
async function getGameRef(gameName: string) {
  let gameRef = await doc(db, "games", `game-${gameName}`)
  return gameRef
}

export { getGameByName, addGame, replaceGrid, addPlayer, getGameRef }