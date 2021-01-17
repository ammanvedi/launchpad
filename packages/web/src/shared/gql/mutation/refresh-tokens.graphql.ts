import gql from 'graphql-tag';

export const refreshTokensMutation = gql`
    mutation refreshTokens {
        refreshTokens
    }
`;
