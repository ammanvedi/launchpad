import gql from 'graphql-tag';
import {GlobalMeFragment} from "../fragment/me.graphql";

export const meQuery = gql`
    ${GlobalMeFragment}
    query me {
        me {
            me {
                ...GlobalMeFragment
            }
        }
    }
`