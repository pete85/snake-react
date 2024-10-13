import React, { useState } from 'react';
import { UserModel } from './models/user';
import {useNavigate} from "react-router-dom";

type UserProps = {
    setUser: React.Dispatch<React.SetStateAction<UserModel>>;
    handleUserSubmit: (name: string) => void;
    handleUserSearch: (name: string) => void;
    existingUsers: UserModel[];
};

const User: React.FC<UserProps> = ({ setUser, handleUserSubmit, handleUserSearch, existingUsers }) => {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        handleUserSearch(name);
        setInputValue(name);
    };

    const handleClick = () => {
        handleUserSubmit(inputValue);
    };

    // Updated to accept a user parameter
    const handleUserSelect = (user: UserModel) => {
        setUser(user);
        navigate('/game');
    };

    return (
        <>
            <div className="tw-flex tw-w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="username-input"
                />
            </div>
            {existingUsers.length > 0 ? (
                <div className="tw-flex tw-w-full">
                    <ul className="user-select-list">
                        {existingUsers.map((user) => (
                            <li key={user._id} className="tw-flex items-center">
                                <button className="tw-w-full" onClick={() => handleUserSelect(user)}>
                                    <span>{user.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="tw-flex tw-w-full">
                    <button onClick={handleClick} className="tw-w-full">Create User</button>
                </div>
            )}
        </>
    );
};

export default User;
