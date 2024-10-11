import { useState } from 'react';
import './App.scss';
import GridCanvas from "./GridCanvas.tsx";
import TimerAndLevel from "./TimerAndLevel.tsx";
import User from "./User.tsx";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
    const [username, setUsername] = useState('');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserSetup setUsername={setUsername} />} />
                <Route path="/game" element={<Game username={username} />} />
            </Routes>
        </Router>
    );
}

const UserSetup = ({ setUsername }: { setUsername: React.Dispatch<React.SetStateAction<string>> }) => {
    const navigate = useNavigate();

    const handleUserSubmit = async (name: string) => {
        try {
            // Send GET request to check if the user already exists
            const response = await axios.get('https://pete85.com:8091/api/snake-game/users');
            const existingUsers = response.data;
            const userExists = existingUsers.some((user: { name: string }) => user.name === name);

            if (userExists) {
                // If user already exists, navigate to the game
                navigate('/game');
            } else {
                // If user does not exist, create a new user
                await axios.post('https://pete85.com:8091/api/snake-game/users', {
                    name: name,
                    highest_score: 0,
                    highest_score_date: new Date().toISOString(),
                });
                navigate('/game');
            }
        } catch (error) {
            console.error('Error checking or creating user:', error);
        }
    };


    return (
        <User
            setUsername={(name: string) => {
                setUsername(name); // Update username in the state
                handleUserSubmit(name); // Submit user details
            }}
        />
    );
};


const Game = ({ username }: { username: string }) => {
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [stopGame, setStopGame] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [reset, setReset] = useState(false);

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
