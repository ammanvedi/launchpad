import {Auth} from 'aws-amplify';
import {useState} from 'react'


export default function SignUp() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleButtonClick = async () => {
        try {
            const { user } = await Auth.signUp({
                username,
                password,
            });
            console.log(user);
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    return (
        <div>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='email' />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
            <button onClick={handleButtonClick} >Sign up</button>
        </div>
    )

}