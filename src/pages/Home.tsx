import { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {

	const [gameName, setGameName] = useState("")
	const handleChangeGameName = (event: any) => {
		setGameName(event.target.value)
	}

	const navigate = useNavigate();
	const goToGame = () => {
		if (gameName !== "") {
			navigate('/tictactoe', {state:{gameName: gameName}});
		}
	}

	return (
		<div className="w-screen h-screen bg-teal-900">
			<div className="w-1/2 m-auto flex flex-col justify-center items-center gap-24 pt-24">
				<h1 className="font-bold text-4xl mt-12 underline hover:text-slate-900 duration-300">React Tic-Tac-Toe</h1>

				<div className="flex flex-row gap-4">
					<label htmlFor="game-name" className="text-2xl">Game Name:</label>
					<input className="appearance-none border-2 border-solid border-black" id="game-name" type="text" onChange={handleChangeGameName}/>
				</div>

				<button className="w-36 h-12 text-xl bg-sky-400 rounded-lg hover:bg-sky-300 duration-200" onClick={goToGame}>Join Game</button>
			</div>
		</div>
	)
}



export default Home