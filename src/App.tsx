import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicTacToe from "./pages/TicTacToe";
import Home from "./pages/Home";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="tictactoe" element={<TicTacToe />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
