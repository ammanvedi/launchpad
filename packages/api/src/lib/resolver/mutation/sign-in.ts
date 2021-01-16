import { GqlError, MutationResolvers, Role } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { setAuthCookiesOnResponse } from '../../authorization/cookie';

export const signInResolver: MutationResolvers<GQLContext>['signIn'] = async (
    parent,
    args,
    context,
) => {
    const tokens = await context.authorizer.signIn(args.username, args.password);

    if (!tokens) {
        throw new Error(GqlError.UsernameOrPasswordIncorrect);
    }

    setAuthCookiesOnResponse(
        tokens.idToken,
        tokens.accessToken,
        tokens.refreshToken,
        context.res,
        process.env.TF_VAR_auth_cookie_domain || '',
        parseInt(process.env.TF_VAR_auth_cookie_expiry_days || ''),
        process.env.TF_VAR_auth_cookie_secure === 'true',
    );

    context.setAuthState(tokens);

    return {
        id: context.authState.id,
        role: context.authState.role || Role.User,
        email: context.authState.email,
        tokensExpireAtUtcSecs: context.authState.tokenExpiresAtUtcSecs,
    };
};
