import {Resolvers} from "../../../generated/graphql";

export const userFieldsResolver: Resolvers['User'] = {
    consents: (parent, args, context, info) => {

        return []
    }
}