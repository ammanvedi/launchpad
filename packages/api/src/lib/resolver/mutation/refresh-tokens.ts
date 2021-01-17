import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { clearAuthCookies, setAuthCookiesOnResponse } from '../../authorization/token';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverRefreshTokens');

export const refreshTokensResolver: MutationResolvers<GQLContext>['refreshTokens'] = async (
    parent,
    args,
    context,
) => {
    if (!context.authState.tokens) {
        throw new Error(GqlError.TokensMissing);
    }

    const refreshResult = await context.authorizer.refreshTokens(
        context.authState.tokens,
    );

    if (!refreshResult) {
        log.warn('Could not refresh tokens, clearing users auth cookies');
        clearAuthCookies(
            context.res,
            process.env.TF_VAR_auth_cookie_domain || '',
            process.env.TF_VAR_auth_cookie_secure === 'true',
        );
        context.setAuthState(null);
        return false;
    }

    log.info('Refreshed tokens adding new tokens to auth state in cookies');

    setAuthCookiesOnResponse(
        refreshResult.idToken,
        refreshResult.accessToken,
        refreshResult.refreshToken || context.authState.tokens.refreshToken,
        context.res,
        process.env.TF_VAR_auth_cookie_domain || '',
        parseInt(process.env.TF_VAR_auth_cookie_expiry_days || ''),
        process.env.TF_VAR_auth_cookie_secure === 'true',
    );

    context.setAuthState(refreshResult);

    return true;
};
