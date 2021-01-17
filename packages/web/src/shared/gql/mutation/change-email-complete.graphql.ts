import gql from 'graphql-tag';

export const changeEmailCompleteMutation = gql`
    mutation changeEmailComplete($code: String!) {
        changeEmailComplete(code: $code)
    }
`;
