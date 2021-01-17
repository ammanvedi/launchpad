import gql from 'graphql-tag';

export const forgotPasswordCompleteMutation = gql`
    mutation forgotPasswordComplete(
        $code: String!
        $newPassword: String!
        $username: String!
    ) {
        forgotPasswordComplete(
            username: $username
            code: $code
            newPassword: $newPassword
        )
    }
`;
