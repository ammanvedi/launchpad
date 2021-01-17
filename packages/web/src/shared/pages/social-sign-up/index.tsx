import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    GqlError,
    Role,
    useMeQuery,
    useRefreshTokensMutation,
    useRegisterExternalUserMutation,
} from '../../gql/generated/graphql';

const Page = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const { data, error } = useMeQuery({ ssr: false, errorPolicy: 'all' });
    const [signUpExternalUser] = useRegisterExternalUserMutation();
    const [refreshTokens] = useRefreshTokensMutation();

    useEffect(() => {
        if (!!data?.me && !error) {
            console.log('user was already registered lets redirect home');
        }
    }, [data, error]);

    const handleButtonClick = async () => {
        try {
            /**
             * Then we register the user in our own database where we store
             * profile information, linked via the ID which is given by the
             * external identity provider
             */
            await signUpExternalUser({
                variables: {
                    user: {
                        bio,
                        firstName,
                        lastName,
                        role: Role.User,
                    },
                },
            }).then((data) => {
                console.log(data);

                return refreshTokens();
                /**
                 * The user previously had no "internalId" in aws cognito
                 * our sign up external user mutation has added one
                 * so we need to make sure that we refresh the users data now
                 * to get the new internal id so we can use it for api requests
                 */
                //return Auth.currentAuthenticatedUser({ bypassCache: true });
            });
        } catch (error) {
            console.log('error signing up:', error);
        }
    };

    const shouldSignUpUser = error?.message === GqlError.NoInternalId;

    return (
        <div>
            {shouldSignUpUser && (
                <div>
                    sign up
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="firstname"
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="lastname"
                    />
                    <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="bio"
                    />
                    <button onClick={handleButtonClick}>Sign up</button>
                </div>
            )}
        </div>
    );
};

export default Page;
