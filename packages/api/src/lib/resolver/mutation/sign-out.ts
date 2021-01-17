import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { clearAuthCookies } from '../../authorization/token';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverSignOut');

export const signOutResolver: MutationResolvers<GQLContext>['signOut'] = async (
    parent,
    { global },
    context,
) => {
    clearAuthCookies(
        context.res,
        process.env.TF_VAR_auth_cookie_domain || '',
        process.env.TF_VAR_auth_cookie_secure === 'true',
    );

    if (global) {
        try {
            await context.authorizer.signOutGlobal(context.authState.email);
        } catch (e) {
            log.err(e);
            switch (e.code) {
                case 'InvalidParameterException':
                    throw new Error(GqlError.InvalidArguments);
                default:
                    throw new Error(GqlError.Unknown);
            }
        }
    }

    return true;
};
