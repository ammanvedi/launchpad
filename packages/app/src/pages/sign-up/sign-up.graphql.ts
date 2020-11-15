import gql from 'graphql-tag';

export const GlobalUserFragment = gql`
    fragment GlobalUserFragment on User {
        id
        firstName
        lastName
        bio
        role
        email
        profileImage
        bio
        role
        consents {
            timestamp
            consentType
        }
    }
`

export const SignUpMutation = gql`
    ${GlobalUserFragment} 
    
    mutation signUp($input: RegisterUserInput) {
        register(user: $input) {
            ...GlobalUserFragment
        }
    }
`