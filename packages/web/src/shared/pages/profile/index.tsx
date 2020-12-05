import React from 'react';
import {useMeQuery, useUploadUserProfileImageMutation} from "../../graphql/generated/graphql";

const Page = () => {
    const {data} = useMeQuery();
    const [upload] = useUploadUserProfileImageMutation()

    // @ts-ignore
    const onChange = ({target: {files: [file]}}) => {
        upload({
            variables: {
                file
            }
        })
    }

    return (
        <div>
            welcome to the sign in page, this page is lazy loaded using react-loadable
            {JSON.stringify(data)}
            {!!data?.me.me?.profileImage && (
                <img src={data?.me.me?.profileImage} />
            )}
            Update profile image
            <input
                type="file"
                required
                onChange={onChange}
            />
        </div>
    )
}

export default Page;
