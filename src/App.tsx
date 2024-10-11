import { useState } from 'react';
import './App.scss';
import GridCanvas from "./GridCanvas.tsx";
import TimerAndLevel from "./TimerAndLevel.tsx";

function App() {
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [stopGame, setStopGame] = useState(false);
    const [startGame, setStartGame] = useState(false);

    return (
        <>
            <div>
                <h2>Score: {count}</h2>
            </div>
            <TimerAndLevel level={level} setLevel={setLevel} startGame={startGame} stopGame={stopGame}/>
            <GridCanvas setCount={setCount} setLevel={setLevel} startTimer={() => setStartGame(true)} stopTimer={() => setStopGame(true)} />
        </>
    );
}

export default App;

