import React from 'react';
import {
    ConsentType,
    useAddConsentMutation, useHelloQuery,
    useMeQuery,
    useUploadUserProfileImageMutation
} from "../../graphql/generated/graphql";
import {Auth} from '@aws-amplify/auth';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {exampleAtom} from "state/atom/example";
import styled from 'styled-components'

const Block = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  display: block;
`

const Page = () => {
    const example = useRecoilValue(exampleAtom);
    const setExample = useSetRecoilState(exampleAtom);
    const {data} = useMeQuery();
    const {data: helloData} = useHelloQuery();
    const [upload] = useUploadUserProfileImageMutation();
    const [consentToCookie] = useAddConsentMutation({
        variables: {
            type: ConsentType.Cookies
        }
    })

    React.useEffect(() => {
        if(data) {
            setExample(strings => [
                ...strings,
                'have user data now'
            ])
        }
    }, [data])

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
                console.log(';err signing out', e)
            })
    }

    return (
        <div>
            <Block />
            welcome to your profile page {data?.me.me?.firstName}
            <div/>
            {!!data?.me.me?.profileImage && (
                <img width={100} height={100} src={data?.me.me?.profileImage} />
            )}
            <pre>
                {JSON.stringify(example)}
            </pre>
            Update profile image
            <input
                type="file"
                required
                onChange={e => onChange(e)}
            />
            <pre>
               {JSON.stringify(data, null, 2)}
            </pre>
            <pre>
               {JSON.stringify(helloData, null, 2)}
            </pre>
            <button onClick={() => consentToCookie()}>
                Click here to consent to cookie tracking
            </button>
            <button onClick={signOut}>
                Log out
            </button>
        </div>
    )
}

export default Page;
