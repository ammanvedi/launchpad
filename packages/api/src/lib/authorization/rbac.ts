import {rule, shield, or, and} from "graphql-shield";
import {GQLContext} from "../context/context";
import {GqlError} from "../../generated/graphql";

export const isAuthenticatedWithInternalId = rule({ cache: "no_cache" })(
    async (parent, args, ctx: GQLContext, info) => {
        return !!ctx.authState.id || new Error(GqlError.Unauthorised)
    }
);

export const isAuthenticatedWithExternalId = rule({ cache: "no_cache" })(
    async (parent, args, ctx: GQLContext, info) => {
        return !!ctx.authState.externalUsername || new Error(GqlError.Unauthorised)
    }
);

type IdFromArgsFunc<ARGS extends object> = (args: ARGS) => string;

export const defaultIdFromArgsFunc: IdFromArgsFunc<{id: string}> = (args) => {
    return args.id ;
}

export const isOperationOnAuthenticatedUserFactory = <ARGS extends object>(idFromArgs: IdFromArgsFunc<ARGS>) =>
        rule({cache: "contextual"})(
            async (parent, args: ARGS, ctx: GQLContext, info) => {
                return ctx.authState.id === idFromArgs(args) || new Error(GqlError.Unauthorised)
            }
        )

export const permissions = shield<any, GQLContext, any>({
    Query: {
        me: or(isAuthenticatedWithInternalId, isAuthenticatedWithExternalId)
    },
    Mutation: {
        registerUserFromExternalProvider: isAuthenticatedWithExternalId,
        addConsent: isAuthenticatedWithInternalId
    }
}, {allowExternalErrors: true})