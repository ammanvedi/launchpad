import gql from 'graphql-tag';

export const setPasswordCompleteMutation = gql`
    mutation setPasswordComplete($currentPassword: String!, $password: String!) {
        setPasswordComplete(password: $password, currentPassword: $currentPassword)
    }
`;
