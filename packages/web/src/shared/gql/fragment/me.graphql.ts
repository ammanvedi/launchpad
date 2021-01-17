import gql from 'graphql-tag';

export const GlobalConsentsFragment = gql`
    fragment GlobalConsentsFragment on Consent {
        id
        consentedTo
    }
`;

export const GlobalMeFragment = gql`
    ${GlobalConsentsFragment}
    fragment GlobalMeFragment on User {
        id
        firstName
        lastName
        profileImage
        consents {
            ...GlobalConsentsFragment
        }
    }
`;
