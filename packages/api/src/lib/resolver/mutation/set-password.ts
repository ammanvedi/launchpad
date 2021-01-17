import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverSetPassword');

export const setPasswordResolver: MutationResolvers<GQLContext>['setPasswordComplete'] = async (
    parent,
    { currentPassword, password },
    context,
) => {
    if (!context.authState.tokens?.accessToken) {
        throw new Error(GqlError.Unauthorised);
    }

    try {
        await context.authorizer.setPasswordComplete(
            currentPassword,
            password,
            context.authState.tokens.accessToken,
        );
        return true;
    } catch (e) {
        log.err(e);
        switch (e.code) {
            case 'InvalidParameterException':
                throw new Error(GqlError.InvalidArguments);
            case 'NotAuthorizedException':
                throw new Error(GqlError.Unauthorised);
            default:
                throw new Error(GqlError.Unknown);
        }
    }
};
