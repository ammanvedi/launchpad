import React, { useState } from 'react';
import { useForgotPasswordBeginMutation } from 'gql/generated/graphql';

const Page = () => {
    const [uName, setUName] = useState<string>('');
    const [forgotBegin] = useForgotPasswordBeginMutation();

    const onForgotPassword = () => {
        forgotBegin({
            variables: {
                username: uName,
            },
        })
            .then(() => {
                console.log('sent');
            })
            .catch(() => {
                console.log('failed sending');
            });
    };

    return (
        <div>
            <input value={uName} onChange={(e) => setUName(e.target.value)} />
            <button onClick={onForgotPassword}>
                Send verification email to reset password
            </button>
        </div>
    );
};

export default Page;
