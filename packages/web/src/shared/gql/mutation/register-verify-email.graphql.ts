import gql from 'graphql-tag';

export const registerVerifyEmailMutation = gql`
    mutation registerVerifyEmail($username: String!, $code: String!) {
        registerVerifyEmail(username: $username, code: $code)
    }
`;
