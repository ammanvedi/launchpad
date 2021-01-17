import gql from 'graphql-tag';

export const registerResendVerificationEmailMutation = gql`
    mutation registerResendVerificationEmail($username: String!) {
        registerResendVerificationEmail(username: $username)
    }
`;
