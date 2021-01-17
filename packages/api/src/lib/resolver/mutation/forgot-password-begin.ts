import { MutationResolvers } from '../../../generated/graphql';
import { GQLContext } from '../../context/context';
import { createLoggerSet } from '../../logging/logger';

const log = createLoggerSet('ResolverForgotPasswordBegin');

export const forgotPasswordBeginResolver: MutationResolvers<GQLContext>['forgotPasswordBegin'] = async (
    parent,
    { username },
    context,
) => {
    try {
        await context.authorizer.forgotPasswordBegin(username);
    } catch (e) {
        log.err(e);
    }

    return true;
};
