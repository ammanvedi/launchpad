import gql from 'graphql-tag';

export const uploadUserProfileImageMutation = gql`
    mutation uploadUserProfileImage($file: Upload!) {
        updateUserProfileImage(file: $file) {
            id
            profileImage
        }
    }
`;
