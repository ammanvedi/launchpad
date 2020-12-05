import {Resolvers} from "../../generated/graphql";
import {GQLContext} from "../context/context";
import {meResolver} from "./query/me";
import {userFieldsResolver} from "./field/user";
import {registerResolver} from "./mutation/register";
import {registerUserFromExternalProviderResolver} from "./mutation/register-user-from-external-provider";
import {updateUserProfileImageResolver} from "./mutation/update-user-profile-image";

export const resolvers: Resolvers<GQLContext> = {
    Query: {
        me: meResolver
    },
    Mutation: {
        register: registerResolver,
        registerUserFromExternalProvider: registerUserFromExternalProviderResolver,
        updateUserProfileImage: updateUserProfileImageResolver
    },
    User: userFieldsResolver
};