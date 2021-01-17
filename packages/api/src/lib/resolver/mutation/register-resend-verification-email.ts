import { MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';

export const registerResendVerificationEmailResolver: MutationResolvers<GQLContext>['registerResendVerificationEmail'] = async (
    parent,
    { username },
    context,
    info,
) => {
    await context.authorizer.signUpResendEmail(username);

    return true;
};
