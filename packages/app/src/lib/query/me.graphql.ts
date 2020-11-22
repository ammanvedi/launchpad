import gql from "graphql-tag";
import {GlobalUserFragment} from "./sign-up.graphql";

export const meQuery = gql`
    ${GlobalUserFragment}

    query me {
        me {
            me {
                ...GlobalUserFragment
            }
        }
    }
`