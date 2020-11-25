import {GqlError, QueryResolvers, Resolvers} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";

export const meResolver: QueryResolvers<GQLContext>['me'] = async (parent, args, context, info) => {
    /**
     * If the user does a me request and they do not have an internal id
     * it probably means that they have been signed up from an external provider
     * but they have yet to create an internal profile so we return a nice error to show this
     */
    if (!context.authState.id) {
        throw new Error(GqlError.NoInternalId)
    }

    return {
        me: null
    };
}