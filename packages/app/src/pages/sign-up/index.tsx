import {Auth} from 'aws-amplify';
import {useState} from 'react'
import {Role, useSignUpMutation} from "../../generated/graphql";


export default function SignUp() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signUpInternalUser, {loading, error, data}] = useSignUpMutation();

    const handleButtonClick = async () => {
        try {
            /**
             * First we sign up the minimum amount of information
             * with the external identity provider which is where
             * we will store all authorization and authentication
             * data
             */
            const { user: cognitoUser } = await Auth.signUp({
                username,
                password,
                attributes: {
                    'custom:role': 'USER'
                }
            });
            console.log(cognitoUser);
            /**
             * Then we register the user in our own database where we store
             * profile information, linked via the ID which is given by the
             * external identity provider
             */
            const { data: {register: {id}} } = await signUpInternalUser({
                variables: {
                    input: {
                        bio: 'default bio',
                        firstName: 'john',
                        lastName: 'appleseed',
                        role: Role.User
                    }
                }
            })
        } catch (error) {
            console.log('error signing up:', error);
        }
    }

    return (
        <div>
            sign up
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} placeholder='email' />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
            <button onClick={handleButtonClick} >Sign up</button>
        </div>
    )

}