import {useState} from 'react';
import './App.scss';
import GridCanvas from "./GridCanvas.tsx";
import TimerAndLevel from "./TimerAndLevel.tsx";
import User from "./User.tsx";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from "./ProtectedRoute.tsx";
import {UserModel} from "./models/user.ts";

function App() {
    const [user, setUser] = useState({});

    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserSetup setUser={setUser} />} />
                <Route
                    path="/game"
                    element={
                        <ProtectedRoute user={user}>
                            <Game user={user} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

const UserSetup = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserModel>> }) => {
    const navigate = useNavigate();
    const [existingUsers, setExistingUsers] = useState([]);

    const handleUserSearch = async (name: string) => {
        try {
            if (name && name !== '') {
                const response = await axios.get(`https://pete85.com:8091/api/snake-game/users/search?name=${name}`);
                if (response.status === 200 && response.data.length) {
                    setExistingUsers(response.data);
                    console.log('Users with partial name:', response.data);
                } else {
                    setExistingUsers([]); // Clear if no results
                }
            } else {
                setExistingUsers([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserSubmit = async (name: string) => {
        try {
            const newUser = {
                name: name,
                highest_score: 0,
                highest_score_date: new Date().toISOString(),
            };

            const response = await axios.post('https://pete85.com:8091/api/snake-game/users', newUser);

            setUser(response.data);
            navigate('/game');
        } catch (error) {
            console.error('Error checking or creating user:', error);
        }
    };


    return (
        <User
            setUser={setUser}
            handleUserSubmit={handleUserSubmit}
            handleUserSearch={handleUserSearch}
            existingUsers={existingUsers}
        />
    );
};



const Game = ({ user }: { user: UserModel }) => {
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [stopGame, setStopGame] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [reset, setReset] = useState(false);

    const resetGame = async () => {
        try {
            // const response = await axios.get('https://pete85.com:8091/api/snake-game/users');
            // const user = response.data.find((user: { name: string }) => user.name === user.name);

            if (user && count > (user.highest_score ?? 0)) {
                console.log('Got here with user: ', user);
                await axios.put(`https://pete85.com:8091/api/snake-game/users/${user._id}`, {
                    highest_score: count,
                    highest_score_date: new Date().toISOString(),
                });
            } else {
                console.log('Got nowhere with user: ', user);
            }
        } catch (error) {
            console.error('Error updating highest score:', error);
        }

        setStopGame(true);
        setStartGame(false);
        setReset(true);

        setTimeout(() => {
            setCount(0);
            setLevel(1);
            setStopGame(false);
            setReset(false);
        }, 100);
    };

    return (
        <>
            <div>
                <h2>User: {user.name}</h2>
                <h1>Score: {count}</h1>
                {/*<h3>Highest: {user.highest_score}</h3>*/}

            </div>
            <TimerAndLevel
                level={level}
                setLevel={setLevel}
                startGame={startGame}
                stopGame={stopGame}
                reset={reset}
            />
            <GridCanvas
                setCount={setCount}
                setLevel={setLevel}
                startTimer={() => {
                    setReset(false);
                    setStartGame(true);
                }}
                stopTimer={() => setStopGame(true)}
                resetTimer={resetGame}
            />
        </>
    );
};

export default App;
