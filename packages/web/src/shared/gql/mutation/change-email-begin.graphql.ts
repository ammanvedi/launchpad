import gql from 'graphql-tag';

export const changeEmailBeginMutation = gql`
    mutation changeEmailBegin($newEmail: String!) {
        changeEmailBegin(newEmail: $newEmail)
    }
`;
