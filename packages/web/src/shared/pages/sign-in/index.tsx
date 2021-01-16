import React, { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useMeQuery, useSignInMutation } from '../../graphql/generated/graphql';
import { amplifyConfig } from '../../amplify';

const getSocialLink = (provider: 'Facebook' | 'Google'): string => {
    return `https://${
        amplifyConfig.oauth.domain
    }/oauth2/authorize?identity_provider=${provider}&redirect_uri=${
        amplifyConfig.oauth.redirectSignIn
    }&response_type=CODE&client_id=${
        amplifyConfig.aws_user_pools_web_client_id
    }&scope=${amplifyConfig.oauth.scope.join(' ')}`;
};

const Page = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { data } = useMeQuery();
    const [signIn] = useSignInMutation();

    const handleButtonClick = async () => {
        try {
            const user = await signIn({
                variables: {
                    username,
                    password,
                },
            });
            console.log(user);
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <div>
            welcome to the sign in page, this page is lazy loaded using react-loadable
            {JSON.stringify(data)}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="email"
            />
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />
            <button onClick={handleButtonClick}>Sign in</button>
            <a href={getSocialLink('Facebook')}>facebook</a>
            <a href={getSocialLink('Google')}>google</a>
            <button>Forgot Passsword?</button>
        </div>
    );
};

export default Page;
