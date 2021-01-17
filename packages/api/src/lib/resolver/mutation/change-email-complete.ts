import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverChangeEmailComplete');

export const changeEmailCompleteResolver: MutationResolvers<GQLContext>['changeEmailComplete'] = async (
    parent,
    { code },
    context,
) => {
    if (!context.authState.tokens?.accessToken) {
        throw new Error(GqlError.Unauthorised);
    }

    try {
        await context.authorizer.changeEmailComplete(
            code,
            context.authState.tokens.accessToken,
        );

        return true;
    } catch (e) {
        log.err(e);
        switch (e.code) {
            case 'CodeMismatchException':
                throw new Error(GqlError.VerificationCodeError);
            default:
                throw new Error(GqlError.Unknown);
        }
    }
};
