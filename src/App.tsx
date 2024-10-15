import React, {useState} from 'react';
import './App.scss';
import GridCanvas from "./GridCanvas.tsx";
import TimerAndLevel from "./TimerAndLevel.tsx";
import User from "./User.tsx";
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from "./ProtectedRoute.tsx";
import {UserModel} from "./models/user.ts";
import HighestScores from "./HighestScores.tsx";
import UsefulLinks from "./UsefulLinks.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronLeft, faChevronRight, faChevronUp} from "@fortawesome/free-solid-svg-icons"; // Imported component

function App() {
    const [user, setUser] = useState<UserModel | null>(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserSetup setUser={setUser} />} />
                <Route
                    path="/game"
                    element={
                        user ? (
                            <ProtectedRoute user={user}>
                                <Game user={user} setUser={setUser} />
                            </ProtectedRoute>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

/**
 * Functional component. setUser stores the selected or newly created user.
 * @param setUser
 * @constructor
 */
const UserSetup = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserModel | null>> }) => {
    const navigate = useNavigate();
    const [existingUsers, setExistingUsers] = useState<UserModel[]>([]); // state variable initialized as an empty array

    /**
     * Take name parameter and search for matching records in the db
     * @param name
     */
    const handleUserSearch = async (name: string) => {
        try {
            const response = await axios.get(`https://pete85.com:8091/api/snake-game/users/search?name=${name}`);
            setExistingUsers(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Create new user with given name
     * @param name
     */
    const handleUserSubmit = async (name: string) => {
        try {
            const newUser = { name, highest_score: 0, highest_score_date: new Date().toISOString() };
            const response = await axios.post('https://pete85.com:8091/api/snake-game/users', newUser);
            setUser(response.data);
            navigate('/game');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <User setUser={setUser} handleUserSubmit={handleUserSubmit} handleUserSearch={handleUserSearch} existingUsers={existingUsers} />
    );
};



const Game = ({ user, setUser }: { user: UserModel | null; setUser: React.Dispatch<React.SetStateAction<UserModel | null>> }) => {
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [stopGame, setStopGame] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [reset, setReset] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const navigate = useNavigate();

    const triggerKeyPress = (key: string) => {
        const event = new KeyboardEvent('keydown', { key });
        window.dispatchEvent(event);
    };

    const resetGame = async () => {
        try {
            if (user && count > (user.highest_score ?? 0)) {
                await axios.put(`https://pete85.com:8091/api/snake-game/users/${user._id}`, {
                    highest_score: count,
                    highest_score_date: new Date().toISOString(),
                });
                const updatedUserResponse = await axios.get(`https://pete85.com:8091/api/snake-game/users/${user._id}`);
                setUser(updatedUserResponse.data);
            }
        } catch (error) {
            console.error('Error updating highest score:', error);
        }

        setStopGame(true);
        setStartGame(false);
        setReset(true);
        setGameFinished(true);

        setTimeout(() => {
            setCount(0);
            setLevel(1);
            setStopGame(false);
            setReset(false);
            setGameFinished(false);
        }, 100);
    };

    // Define switchUser function to reset user and game
    const switchUser = () => {
        setCount(0);
        setLevel(1);
        setStopGame(false);
        setStartGame(false);
        setReset(false);
        setGameFinished(false);
        setUser(null); // Clear the current user
        navigate('/'); // Redirect to home
    };

    return (
        <>
            <div className="tw-relative md:tw-absolute md:tw-top-5 md:tw-left-5">
                <button onClick={switchUser} className="tw-mb-2">Switch user</button>
                <div className="tw-flex tw-flex-row tw-gap-5 tw-justify-center tw-items-center md:tw-flex-col tw-mb-2">
                    <h2 className="outlined-text">User: {user?.name}</h2>
                    <h2 className="outlined-text">Score: {count}</h2>
                    <h3 className="outlined-text hide-mobile">Highest: {user?.highest_score}</h3>
                </div>
                <TimerAndLevel level={level} setLevel={setLevel} startGame={startGame} stopGame={stopGame}
                               reset={reset}/>
            </div>
            <div className="tw-absolute tw-right-5 tw-top-5 highest-scores hide-mobile">
                <HighestScores limit={10} gameFinished={gameFinished}/>
            </div>
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


                <div className="arrow-buttons-container hide-desktop">
                    <button id="arrowUpBtn" onClick={() => triggerKeyPress('ArrowUp')}>
                        <FontAwesomeIcon icon={faChevronUp}/>
                    </button>
                    <button id="arrowLeftBtn" onClick={() => triggerKeyPress('ArrowLeft')}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <button id="arrowDownBtn" onClick={() => triggerKeyPress('ArrowDown')}>
                        <FontAwesomeIcon icon={faChevronDown}/>
                    </button>
                    <button id="arrowRightBtn" onClick={() => triggerKeyPress('ArrowRight')}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>
            {/* Render snake and game logic */}

            <div className="tw-absolute tw-left-0 tw-bottom-0 tw-w-full hide-mobile">
                <UsefulLinks></UsefulLinks>
            </div>
        </>
    );
};


export default App;
