import { rule, shield, or, and } from 'graphql-shield';
import { GQLContext } from '../context/context';
import { GqlError } from '../../generated/graphql';

export const isAuthenticatedWithInternalId = rule({ cache: 'no_cache' })(
    async (parent, args, ctx: GQLContext) => {
        return !!ctx.authState.id || new Error(GqlError.Unauthorised);
    },
);

export const isAuthenticatedWithExternalId = rule({ cache: 'no_cache' })(
    async (parent, args, ctx: GQLContext) => {
        return !!ctx.authState.externalUsername || new Error(GqlError.Unauthorised);
    },
);

export const isAuthenticatedWithTokens = rule({ cache: 'no_cache' })(
    async (parent, args, ctx: GQLContext) => {
        return !!ctx.authState.tokens || new Error(GqlError.TokensMissing);
    },
);

type IdFromArgsFunc<ARGS extends Record<any, any>> = (args: ARGS) => string;

export const defaultIdFromArgsFunc: IdFromArgsFunc<{ id: string }> = (args) => {
    return args.id;
};

export const isOperationOnAuthenticatedUserFactory = <ARGS extends Record<any, any>>(
    idFromArgs: IdFromArgsFunc<ARGS>,
) =>
    rule({ cache: 'contextual' })(async (parent, args: ARGS, ctx: GQLContext, info) => {
        return ctx.authState.id === idFromArgs(args) || new Error(GqlError.Unauthorised);
    });

export const permissions = shield<any, GQLContext, any>(
    {
        Query: {
            me: or(isAuthenticatedWithInternalId, isAuthenticatedWithExternalId),
        },
        Mutation: {
            registerUserFromExternalProvider: isAuthenticatedWithExternalId,
            addConsent: isAuthenticatedWithInternalId,
            updateUserProfileImage: isAuthenticatedWithInternalId,
            refreshTokens: isAuthenticatedWithTokens,
        },
    },
    { allowExternalErrors: true },
);
