import gql from 'graphql-tag'

export const GlobalMeFragment = gql`
    fragment GlobalMeFragment on User {
        id
        firstName
        lastName
        profileImage
        consents {
            id
            consentedTo
        }
    }
`;