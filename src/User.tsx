import React, {useState} from 'react';
import {UserModel} from "./models/user.ts";

type UserProps = {
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    handleUserSubmit: (name: string) => void;
    handleUserSearch: (name: string) => void;
    existingUsers: UserModel[];
};

const User: React.FC<UserProps> = ({setUsername, handleUserSubmit, handleUserSearch, existingUsers}) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;

        console.log('handleChange name: ', event.target.value);
        handleUserSearch(name);

        setInputValue(name);
        setUsername(name);
    };

    const handleClick = () => {
        handleUserSubmit(inputValue);
    };

    return (
        <>
            <div className="tw-flex tw-w-full">
                <input type="text" value={inputValue} onChange={handleChange} placeholder="Enter your username"
                       className="username-input"/>
            </div>
            {(existingUsers.length > 0) ? (
                <div className="tw-flex tw-w-full">
                    <ul className="users-list">
                        {existingUsers.map((user) => (
                            <li key={user._id}>{user.name}</li>
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
