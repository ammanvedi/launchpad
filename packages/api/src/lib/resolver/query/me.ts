import {QueryResolvers, Resolvers} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";

export const meResolver: QueryResolvers<GQLContext>['me'] = (parent, args, context, info) => {
    return null;
}