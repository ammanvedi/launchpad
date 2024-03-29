import React, { useState } from 'react';
import { useRegisterVerifyEmailMutation } from 'gql/generated/graphql';

export default function SignUpVerify() {
    const [code, setCode] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [verify] = useRegisterVerifyEmailMutation();

    const handleButtonClick = async () => {
        try {
            await verify({
                variables: {
                    code,
                    username,
                },
            });
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleButtonClick}>verify</button>
        </div>
    );
}
