import React, { useEffect, useState } from 'react';
import {appConfig} from "./app-config.ts";

type TimerAndLevelProps = {
    level: number;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    startGame: boolean;
    stopGame: boolean;
    reset: boolean;
};

const TimerAndLevel: React.FC<TimerAndLevelProps> = ({ level, setLevel, startGame, stopGame, reset }) => {
    const [time, setTime] = useState(0);

    // Handle timer reset
    useEffect(() => {
        if (reset) {
            setTime(0);
        }
    }, [reset]);

    // Timer for game time
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;

        if (startGame && !stopGame) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        if (stopGame) {
            timer = setInterval(() => {
                setTime(0);
            }, 1000);
        }

        return () => {
            if (timer !== null) {
                clearInterval(timer);
            }
        };
    }, [startGame, stopGame]);

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

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div>
            <div>
                <h4>Time: {formatTime(time)}</h4>
            </div>
            <div>
                <h4>Level: {level}</h4>
            </div>
        </div>
    );
};

export default TimerAndLevel;
