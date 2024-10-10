import React, { useEffect, useState } from 'react';

type TimerAndLevelProps = {
    level: number;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    startGame: boolean;
    stopGame: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimerAndLevel: React.FC<TimerAndLevelProps> = ({ level, setLevel, startGame, stopGame }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;

        if (startGame && !stopGame) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (timer !== null) {
                clearInterval(timer);
            }
        };
    }, [startGame, stopGame]);

    useEffect(() => {
        let levelTimer: ReturnType<typeof setInterval> | null = null;

        if (startGame && !stopGame) {
            levelTimer = setInterval(() => {
                setLevel((prevLevel) => prevLevel + 1);
            }, 60000);
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
