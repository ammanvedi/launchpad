import {rule, shield} from "graphql-shield";
import {GQLContext} from "../context/context";
import {GQLError} from "../error/constants";

export const isAuthenticated = rule({ cache: "contextual" })(
    async (parent, args, ctx: GQLContext, info) => {
        return !!ctx.authState.id || new Error(GQLError.UNAUTHORISED)
    }
);

type IdFromArgsFunc<ARGS extends object> = (args: ARGS) => string;

export const defaultIdFromArgsFunc: IdFromArgsFunc<{id: string}> = (args) => {
    return args.id ;
}

export const isOperationOnAuthenticatedUserFactory = <ARGS extends object>(idFromArgs: IdFromArgsFunc<ARGS>) =>
        rule({cache: "contextual"})(
            async (parent, args: ARGS, ctx: GQLContext, info) => {
                return ctx.authState.id === idFromArgs(args) || new Error(GQLError.UNAUTHORISED)
            }
        )

export const permissions = shield<any, GQLContext, any>({
    Query: {
        me: isAuthenticated
    }
})