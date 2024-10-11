import React, { useState } from 'react';

type UserProps = {
    setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const User: React.FC<UserProps> = ({ setUsername }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUsername(inputValue); // Set the username when the form is submitted
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <label htmlFor="username">Enter your username: </label>
            <input
                type="text"
                id="username"
                value={inputValue}
                onChange={handleInputChange}
                style={{ marginRight: '10px' }}
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default User;
