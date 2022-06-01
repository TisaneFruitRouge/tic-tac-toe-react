import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Cell from '../components/Cell'

import db from '../assets/js/firestore.js'
import { Game, getGameByName, addGame, replaceGrid, addPlayer, getGameRef } from '../assets/js/games.js'
  

import { onSnapshot, doc } from "firebase/firestore"

/**
 * This function checks if one player won by filling a row
 * Returns 1 or 2 if one of the player did win, 0 otherwise
 */
function checkRows(grid: Array<Array<number>>) {
  for (let i = 0; i<3; i++) {
    let row = grid[i]

    if (row.every(c=>c==1) || row.every(c=>c==2))
      return row[0]
  }
  return 0
}

/**
 * This function checks if one player won by filling a column
 * Returns 1 or 2 if one of the player did win, 0 otherwise
 */
function checkCols(grid: Array<Array<number>>) {

  for (let i = 0; i<3; i++) {
    if (grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i])
      if (grid[0][i] !== 0) 
        return grid[0][i]
  }
  return 0;
}


/**
 * This function checks if one player won by filling a diagonal
 * Returns 1 or 2 if one of the player did win, 0 otherwise
 */
function checkDiags(grid: Array<Array<number>>) {
  if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]){
    if (grid[0][0] !== 0) return grid[0][0]
  }
  else if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]){
    if (grid[0][2] !== 0) return grid[0][2]
  }

  return 0;
}




function TicTacToe() {
  
  let [grid, setGrid] = useState([[0,0,0],[0,0,0],[0,0,0]])
  let [playerTurn, setPlayerTurn] = useState(1);
  let [gameOver, setGameOver] = useState(false)
  let [winner, setWinner] = useState(0)
  let [player, setPlayer] = useState(0)

  const location: any = useLocation();
  const gameName = location.state.gameName

  async function getGame(gameName: string) {
    let game: Game = await getGameByName(gameName)

    if (game !== undefined) { // game already exists

      let cells = []
      for (let i = 0; i<3; i++){
        cells.push([game.grid[3*i],game.grid[3*i+1],game.grid[3*i+2]])
      }


      if (game.nb_players >= 2) {
        setPlayer(-1) // not a player
      }
      else {
        setPlayer(game.nb_players + 1)
        game.nb_players = game.nb_players+1;
        addPlayer(gameName, game.nb_players)
      }

      setPlayerTurn( game.player_turn )
      checkWinner(cells)
      setGrid(cells)

    }
    else { // game doesn't exist

      let game:Game = {
        grid: [0,0,0,0,0,0,0,0,0],
        name: gameName,
        nb_players: 1, 
        player_turn: 1
      }

      setPlayerTurn(1)
      setPlayer(1)

      await addGame(game)
    }
  }

  try {
    const unsub = onSnapshot(doc(db, "games", `game-${gameName}`), (doc) => {
      const grid = doc.data()!.grid;
      const playerTurn_data = doc.data()!.player_turn;

      let cells = []
      for (let i = 0; i<3; i++){
        cells.push([grid[3*i],grid[3*i+1],grid[3*i+2]])
      }

      checkWinner(cells)  
      setGrid(cells)
      setPlayerTurn(playerTurn_data) // setting the local player turn ti the game's current player turn

    });
  } catch (e) {
    console.log(`Error: ${e}`)
  }

  useEffect(()=>{
    async function _get_game(){
      await getGame(gameName)
    }
    _get_game()
  }, [])




  const checkWinner = (grid: Array<Array<number>>) => { // checks weither a player has won 
    let win = checkCols(grid) || checkRows(grid) || checkDiags(grid)

    if (win !== 0) {
      setWinner(win)
      setGameOver(true)
    }
    else { // used when reseting the game
      setWinner(0)
      setGameOver(false)
      setPlayerTurn(1)
    }
  }

  // this function adds a mark on the grid
  const add_mark = async (row_number: number, col_number: number) => {
    if (grid[row_number][col_number] === 0 && !gameOver && (player == playerTurn)) { // check if the cell is empty or if the game is already over
      let cells = [[...grid[0]],[...grid[1]],[...grid[2]]]
      
      cells[row_number][col_number] = playerTurn

      let turn = -1;

      if (playerTurn === 1) {
        turn = 2
      }
      else {
        turn = 1
      }

      checkWinner(cells)  
      await replaceGrid(cells, gameName, turn) // making the change inside the firestore document
      setPlayerTurn(turn)
      setGrid(cells)

    }
  }

  const resetGrid = async () => {

    if (player !== 1 && player !== 2) return; // spectators cannot reset the game

    setGrid([[0,0,0],[0,0,0],[0,0,0]])
    setPlayerTurn(1)
    setGameOver(false)
    setWinner(0)

    await replaceGrid(Array(3).fill(Array(3).fill(0)) , gameName, 1)

  }

  const grid_comp = grid.map((row, index) =>
    <li className="h-1/3" key={`li-${index}`}>
      <div className="flex flex-row" >
        <Cell mark={row[0]} row={index} col={0} add_mark={add_mark} />
        <Cell mark={row[1]} row={index} col={1} add_mark={add_mark} />
        <Cell mark={row[2]} row={index} col={2} add_mark={add_mark} />
      </div>
    </li>
  )
  return (
      <div className="w-screen h-screen bg-teal-900 flex flex-col items-center justify-start gap-4">
        <h1 className="font-bold text-4xl mt-12 mb-32 underline hover:text-slate-900 duration-300">React Tic-Tac-Toe</h1>
        <a 
          href="https://starling-burgers.com/" 
          target="_blank" 
          className={`${gameOver ? 'visible' : 'invisible'} text-2xl font-semibold text-cyan-100`}>
          Player {winner} wins ! 🎉 🎉</a>

        <ul className="w-96 h-96">
          {grid_comp}
        </ul>
        <button className="w-36 h-12 text-xl bg-sky-400 rounded-lg hover:bg-sky-300 duration-200"
          onClick={resetGrid}>
          Reset Grid
        </button>
      </div>
  )
}

export default TicTacToe