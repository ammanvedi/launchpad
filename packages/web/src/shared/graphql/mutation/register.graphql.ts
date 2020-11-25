import gql from 'graphql-tag';
import {GlobalMeFragment} from "graphql/fragment/me.graphql";

export const registerExternalUserMutation = gql`
    ${GlobalMeFragment}
    
    mutation registerExternalUser($user: RegisterUserFromExternalProviderInput) {
        registerUserFromExternalProvider(user: $user) {
            ...GlobalMeFragment
        }
    }
`;

export const registerMutation = gql`
    mutation register($input: RegisterUserInput) {
        register(user: $input)
    }
`