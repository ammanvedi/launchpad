import gql from 'graphql-tag';

export const forgotPasswordBeginMutation = gql`
    mutation forgotPasswordBegin($username: String!) {
        forgotPasswordBegin(username: $username)
    }
`;
