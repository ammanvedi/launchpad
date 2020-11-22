import {Auth} from 'aws-amplify';
import {useState} from 'react';
import Link from 'next/link'

export default function SignUp() {
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
            <Link href="/">home</Link>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='email' />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
            <button onClick={handleButtonClick} >Sign in</button>
        </div>
    )

}