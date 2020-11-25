import {Resolvers} from "../../generated/graphql";
import {GQLContext} from "../context/context";
import {meResolver} from "./query/me";
import {userFieldsResolver} from "./field/user";
import {registerResolver} from "./mutation/register";
import {registerUserFromExternalProviderResolver} from "./mutation/register-user-from-external-provider";

export const resolvers: Resolvers<GQLContext> = {
    Query: {
        me: meResolver
    },
    Mutation: {
        register: registerResolver,
        registerUserFromExternalProvider: registerUserFromExternalProviderResolver
    },
    User: userFieldsResolver
};