import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverChangeEmailBegin');

export const changeEmailBeginResolver: MutationResolvers<GQLContext>['changeEmailBegin'] = async (
    parent,
    { newEmail },
    context,
) => {
    if (!context.authState.tokens?.accessToken) {
        throw new Error(GqlError.Unauthorised);
    }

    try {
        await context.authorizer.changeEmailBegin(
            newEmail,
            context.authState.tokens.accessToken,
        );

        return true;
    } catch (e) {
        log.err(e);
        switch (e.code) {
            default:
                throw new Error(GqlError.Unknown);
        }
    }
};
