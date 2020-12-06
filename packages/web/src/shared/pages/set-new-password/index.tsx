import React, {useState} from 'react';
import {Auth} from '@aws-amplify/auth';

const Page = () => {
    const [uName, setUName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [newPwd, setNewPwd] = useState<string>('');

    const onForgotPassword = ( ) => {
        Auth.forgotPasswordSubmit(uName, code, newPwd)
            .then(() => {
                console.log('sent')
            })
            .catch(() => {
                console.log('failed sending')
            })
    }

    return (
        <div>
            <input placeholder='ussername' value={uName} onChange={e => setUName(e.target.value)} />
            <input placeholder='code' value={code} onChange={e => setCode(e.target.value)} />
            <input placeholder='new password' value={newPwd} onChange={e => setNewPwd(e.target.value)} />
            <button onClick={onForgotPassword} >Set new password</button>
        </div>
    )
}

export default Page;
