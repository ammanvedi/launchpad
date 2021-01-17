import React, { useState } from 'react';
import { Role, useRegisterMutation } from '../../gql/generated/graphql';

export default function SignUp() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signUpInternalUser] = useRegisterMutation();

    const handleButtonClick = async () => {
        try {
            /**
             * Then we register the user in our own database where we store
             * profile information, linked via the ID which is given by the
             * external identity provider
             */
            await signUpInternalUser({
                variables: {
                    input: {
                        email: username,
                        password,
                        bio: 'default bio',
                        firstName: 'john',
                        lastName: 'appleseed',
                        role: Role.User,
                    },
                },
            });
        } catch (error) {
            console.log('error signing up:', error);
        }
    };

    return (
        <div>
            sign up
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
            <button onClick={handleButtonClick}>Sign up</button>
        </div>
    );
}
