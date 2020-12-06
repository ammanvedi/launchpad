import React from 'react';
import {
    ConsentType,
    useAddConsentMutation, useHelloQuery,
    useMeQuery,
    useUploadUserProfileImageMutation
} from "../../graphql/generated/graphql";
import {Auth} from '@aws-amplify/auth';

const Page = () => {
    const {data} = useMeQuery();
    const {data: helloData} = useHelloQuery();
    const [upload] = useUploadUserProfileImageMutation();
    const [consentToCookie] = useAddConsentMutation({
        variables: {
            type: ConsentType.Cookies
        }
    })

    // @ts-ignore
    const onChange = ({target: {files: [file]}}) => {
        upload({
            variables: {
                file
            }
        })
    }

    const signOut = () => {
        Auth.signOut()
            .then(() => {
                console.log('signed out')
            })
            .catch(e => {
                conssole.log(';err signing out', e)
            })
    }

    return (
        <div>
            welcome to your profile page {data?.me.me?.firstName}
            <div/>
            {!!data?.me.me?.profileImage && (
                <img width={100} height={100} src={data?.me.me?.profileImage} />
            )}
            Update profile image
            <input
                type="file"
                required
                onChange={onChange}
            />
            <pre>
               {JSON.stringify(data, null, 2)}
            </pre>
            <pre>
               {JSON.stringify(helloData, null, 2)}
            </pre>
            <button onClick={consentToCookie}>
                Click here to consent to cookie tracking
            </button>
            <button onClick={signOut}>
                Log out
            </button>
        </div>
    )
}

export default Page;
