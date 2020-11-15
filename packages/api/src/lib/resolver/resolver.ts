import {Resolvers} from "../../generated/graphql";
import {GQLContext} from "../context/context";
import {meResolver} from "./query/me";
import {userFieldsResolver} from "./field/user";
import {registerResolver} from "./mutation/register";

export const resolvers: Resolvers<GQLContext> = {
    Query: {
        me: meResolver
    },
    Mutation: {
        register: registerResolver
    },
    User: userFieldsResolver
};