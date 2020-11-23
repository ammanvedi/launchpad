import React, {useState} from 'react';
import {Auth} from '@aws-amplify/auth';

const Page = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleButtonClick = async () => {
        try {
            const user = await Auth.signIn(username, password);
            console.log(user)
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    return (
        <div>

            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='email' />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
            <button onClick={handleButtonClick} >Sign in</button>
        </div>
    )
}

export default Page;
