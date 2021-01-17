import gql from 'graphql-tag';

export const signOutMutation = gql`
    mutation signOut($global: Boolean) {
        signOut(global: $global)
    }
`;
