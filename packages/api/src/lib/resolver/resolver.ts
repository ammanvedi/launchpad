import {Resolvers} from "../../generated/graphql";
import {GQLContext} from "../context/context";
import {meResolver} from "./query/me";
import {userFieldsResolver} from "./field/user";

export const resolvers: Resolvers<GQLContext> = {
    Query: {
        me: meResolver
    },
    User: userFieldsResolver
};