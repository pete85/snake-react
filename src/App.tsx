import { useState } from 'react';
import './App.scss';
import GridCanvas from "./GridCanvas.tsx";
import TimerAndLevel from "./TimerAndLevel.tsx";
import User from "./User.tsx";

function App() {
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [stopGame, setStopGame] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [reset, setReset] = useState(false);
    const [username, setUsername] = useState('');

    console.log('Count: ', count);

    const resetGame = () => {
        setStopGame(true);
        setStartGame(false);
        setReset(true); // Set reset to true to trigger the timer reset

        // Delay reset to avoid React warning about updating state during render
        setTimeout(() => {
            setCount(0);
            setLevel(1);
            setStopGame(false);
            setReset(false); // Set reset back to false after resetting
        }, 100);
    };

    return (
        <>
            <User setUsername={setUsername} />
            <div>
                <h2>User: {username}</h2>
                <h1>Score: {count}</h1>
            </div>
            <TimerAndLevel level={level} setLevel={setLevel} startGame={startGame} stopGame={stopGame} reset={reset} />
            <GridCanvas
                setCount={setCount}
                setLevel={setLevel}
                startTimer={() => setStartGame(true)}
                stopTimer={() => setStopGame(true)}
                resetTimer={resetGame}
            />
        </>
    );
}

export default App;