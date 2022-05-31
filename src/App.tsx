import { useState } from 'react'
import Cell from './components/Cell.tsx'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';


import './App.css'

/**
 * This function checks if one player won by filling a row
 * Returns 1 or 2 if one of the player did win, 0 otherwise
 */
function checkRows(grid) {
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
function checkCols(grid) {

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
function checkDiags(grid) {
  if (grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]){
    if (grid[0][0] !== 0) return grid[0][0]
  }
  else if (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0]){
    if (grid[0][2] !== 0) return grid[0][2]
  }

  return 0;
}

function App() {
  
  let [grid, setGrid] = useState([[0,0,0],[0,0,0],[0,0,0]])
  let [player, setPlayer] = useState(1);
  let [gameOver, setGameOver] = useState(false)
  let [winner, setWinner] = useState(0)


  const checkWinner = (grid) => { // checks weither a player has won 
    let win = checkCols(grid) || checkRows(grid) || checkDiags(grid)

    if (win !== 0) {
      setWinner(win)
      setGameOver(true)
    }
  }

  // this function adds a mark on the grid
  const add_mark = (row_number: number, col_number: number) => {
    if (grid[row_number][col_number] === 0 && !gameOver) { // check if the cell is empty or if the game is already over
      let cells = [[...grid[0]],[...grid[1]],[...grid[2]]]
      
      cells[row_number][col_number] = player
      
      if (player == 1) setPlayer(2) // the player changes every turn
      else setPlayer(1)

      checkWinner(cells)  
      setGrid(cells)
    }
  }

  const resetGrid = () => {
    setGrid([[0,0,0],[0,0,0],[0,0,0]])
    setPlayer(1)
    setGameOver(false)
    setWinner(0)
  }

  const grid_comp = grid.map((row, index) =>
    <li className="h-1/3 ">
      <div className="flex flex-row">
        <Cell mark={row[0]} row={index} col={0} key={`cell-${index}-0`} add_mark={add_mark} />
        <Cell mark={row[1]} row={index} col={1} key={`cell-${index}-1`} add_mark={add_mark} />
        <Cell mark={row[2]} row={index} col={2} key={`cell-${index}-2`} add_mark={add_mark} />
      </div>
    </li>
  )
  return (
    <RecoilRoot>
      <div className="App w-screen h-screen bg-teal-900 flex flex-col items-center justify-start gap-4">
        <h1 className="font-bold text-4xl mt-12 mb-32 underline hover:text-slate-900 duration-300">React Tic-Tac-Toe</h1>
        <a 
          href="https://starling-burgers.com/" 
          target="_blank" 
          className={`${gameOver ? 'visible' : 'invisible'} text-2xl font-semibold text-cyan-100`}>
          Player {winner} wins ! 🎉 🎉</a>

        <ul className="w-96 h-96">
          {grid_comp}
        </ul>
        <button className="w-36 h-12 text-xl bg-sky-400 rounded-lg"
          onClick={resetGrid}>
          Reset Grid
        </button>
      </div>
    </RecoilRoot>
  )
}

export default App
