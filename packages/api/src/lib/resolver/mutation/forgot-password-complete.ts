import { GqlError, MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverForgotPasswordComplete');

export const forgotPasswordCompleteResolver: MutationResolvers<GQLContext>['forgotPasswordComplete'] = async (
    parent,
    { username, newPassword, code },
    context,
) => {
    try {
        await context.authorizer.forgotPasswordComplete(code, newPassword, username);
    } catch (e) {
        log.err(e);
        switch (e.code) {
            case 'CodeMismatchException':
                throw new Error(GqlError.VerificationCodeError);
            default:
                throw new Error(GqlError.Unknown);
        }
    }

    return true;
};
