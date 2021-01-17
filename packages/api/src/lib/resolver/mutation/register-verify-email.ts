import { MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';

export const registerVerifyEmailResolver: MutationResolvers<GQLContext>['registerVerifyEmail'] = async (
    parent,
    { code, username },
    context,
) => {
    await context.authorizer.signUpConfirmEmail(username, code);
    return true;
};
