import gql from 'graphql-tag';

export const helloQuery = gql`
    query hello {
        helloWorld {
            hello
        }
    }
`;
