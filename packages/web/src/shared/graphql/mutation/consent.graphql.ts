import gql from 'graphql-tag';
import {GlobalConsentsFragment} from "graphql/fragment/me.graphql";

export const addConsentMutation = gql`
    ${GlobalConsentsFragment}
    mutation addConsent($type: ConsentType!) {
        addConsent(type: $type) {
            user {
                id
                consents {
                    ...GlobalConsentsFragment
                }
            }
        }
    }
`;