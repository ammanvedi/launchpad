import React, { useState } from 'react';
import { Auth } from '@aws-amplify/auth';

const Page = () => {
    const [uName, setUName] = useState<string>('');

    const onResendRequest = () => {
        Auth.resendSignUp(uName)
            .then(() => {
                console.log('sent');
            })
            .catch(() => {
                console.log('failed sending');
            });
    };

    return (
        <div>
            <input
                placeholder="username"
                value={uName}
                onChange={(e) => setUName(e.target.value)}
            />
            <button onClick={onResendRequest}>Re send the verification email</button>
        </div>
    );
};

export default Page;
