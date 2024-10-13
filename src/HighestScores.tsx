import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserModel } from './models/user';

type HighestScoresProps = {
    limit?: number; // Optional limit prop to control the number of top users
};

const HighestScores: React.FC<HighestScoresProps> = ({ limit = 10 }) => {
    const [highestScoreUsers, setHighestScoreUsers] = useState<UserModel[]>([]);

    useEffect(() => {
        const fetchHighestScores = async () => {
            try {
                const response = await axios.get(`https://pete85.com:8091/api/snake-game/users/top-scores?limit=${limit}`);
                if (response.status === 200 && response.data.length) {
                    setHighestScoreUsers(response.data); // Set top users in state
                }
            } catch (error) {
                console.error('Error fetching highest scores:', error);
            }
        };

        fetchHighestScores();
    }, [limit]); // Re-fetch if limit changes

    return (
        <div className="highest-scores">
            <h2>Top Scores</h2>
            <ul className="users-list">
                {highestScoreUsers.map((user) => (
                    <li key={user._id}>
                        <h4>{user.name}</h4>
                        <h4>{user.highest_score}</h4>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HighestScores;
