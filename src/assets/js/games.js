import db from './firestore.js'
import { setDoc, addDoc, getDoc, updateDoc, collection, doc, onSnapshot } from 'firebase/firestore'

/**
 * This function returns a game, which name was given as a parameter to this function
 * Returns null if the game doesn't exist
 */
async function getGameByName(name) {
  
  let data = null;

  const gameRef = doc(db, "games", `game-${name}`);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    data = gameSnap.data();
  }

  return data
}

/**
 * This function adds a game into the 'games' collection on the firestore
 */
async function addGame(game) {

  let name = game.name

  let existingGame = await getGameByName(name)

  if (existingGame !== null) { // game with such name already exists
    return;
  } 

  let gameRef = doc(db, "games", `game-${name}`)

  try {
    await setDoc(gameRef, game);
    console.log("Document written with ID: ", gameRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/**
 * This function replaces the grid and changes the player turn for a given game
 */
async function replaceGrid(grid, gameName, playerTurn) {

  const gameRef = doc(db, "games", `game-${gameName}`)
  const res = await updateDoc(gameRef, {
    grid: [].concat(...grid),
    player_turn: playerTurn
  });
}

/**
 * This function adds a player to a given game
 */
async function addPlayer(gameName, nb_players) {
  const gameRef = doc(db, "games", `game-${gameName}`)
  const res = await updateDoc(gameRef, {nb_players: nb_players});
}

/**
 * This function gets a firesotre game reference given a game name
 */
async function getGameRef(gameName) {
  let gameRef = await doc(db, "games", `game-${gameName}`)
  return gameRef
}

export { getGameByName, addGame, replaceGrid, addPlayer, getGameRef }