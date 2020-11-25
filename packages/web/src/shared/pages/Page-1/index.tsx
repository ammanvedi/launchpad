import React, {useState} from 'react';
import {Auth} from '@aws-amplify/auth';
import {useMeQuery} from "../../graphql/generated/graphql";

const Page = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {data} = useMeQuery();

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
            {JSON.stringify(data)}
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='email' />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
            <button onClick={handleButtonClick} >Sign in</button>
            dasasd
            <a href='https://habu-auth-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=http://localhost:8500/social-sign-up&response_type=CODE&client_id=72s7db3lajg3ge295nrk5a1k5v&scope=aws.cognito.signin.user.admin email openid phone profile'>facebook</a>
            <a href='https://habu-auth-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=http://localhost:8500/social-sign-up&response_type=CODE&client_id=72s7db3lajg3ge295nrk5a1k5v&scope=aws.cognito.signin.user.admin email openid phone profile'>google</a>
        </div>
    )
}

export default Page;
