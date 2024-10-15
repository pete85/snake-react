import React, {useEffect} from 'react';
import {appConfig} from "./app-config.ts";

type TimerAndLevelProps = {
    level: number;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    startGame: boolean;
    stopGame: boolean;
    reset: boolean;
};

const TimerAndLevel: React.FC<TimerAndLevelProps> = ({ level, setLevel, startGame, stopGame }) => {

    // Level timer (increase every minute)
    useEffect(() => {
        let levelTimer: ReturnType<typeof setInterval> | null = null;

        if (startGame && !stopGame) {
            levelTimer = setInterval(() => {
                setLevel((prevLevel) => prevLevel + 1);
            }, appConfig.levelInterval);
        }

        return () => {
            if (levelTimer !== null) {
                clearInterval(levelTimer);
            }
        };
    }, [startGame, stopGame, setLevel]);

    return (
        <div className="hide-mobile">
            <div>
                <h3 className="outlined-text">Level: {level}</h3>
            </div>
        </div>
    );
};

export default TimerAndLevel;
