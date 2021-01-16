import gql from 'graphql-tag';
import { GlobalMeFragment } from 'graphql/fragment/me.graphql';

export const signInMutation = gql`
    ${GlobalMeFragment}
    mutation signIn($username: String!, $password: String!) {
        signIn(password: $password, username: $username) {
            ...GlobalMeFragment
        }
    }
`;
