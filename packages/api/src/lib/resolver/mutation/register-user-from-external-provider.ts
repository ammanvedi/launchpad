import {MutationResolvers} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {GqlError} from "../../../generated/graphql";
import { v4 as uuidv4 } from 'uuid';
import {meResolver} from "../query/me";

/**
 * A user will be redirected to the app already signed in, they will then try to
 * fetch their own user data. if this fails then they will be asked to register
 * at this point we will collect their information and create a new linked user in
 * our database
 */
export const registerUserFromExternalProviderResolver: MutationResolvers<GQLContext>['registerUserFromExternalProvider']
    = async (parent, args, context, info) => {

    if (!args.user) {
        throw new Error(GqlError.InvalidArguments);
    }

    // First check that the user does not already exist based on external id
    const existingUser = await context.db.user.findFirst({where:{
        externalId: context.authState.sub
    }});

    if(existingUser) {
        throw new Error(GqlError.UserExists)
    }

    const proposedId = uuidv4();

    try {
        await context.db.user.create({data: {
            id: proposedId,
            externalId: context.authState.externalUsername,
            ...args.user
        }});
    } catch {
        throw new Error(GqlError.InternalUserCreationFailed)
    }

    try {
        await context.authorizer.linkExternalUserToInternalUser(
            context.authState.externalUsername,
            proposedId,
            args.user.role
        );
    } catch {
        throw new Error(GqlError.CognitoCreationFailed)
    }

    context.authState.id = proposedId;

    console.log('nwerwer')

    // @ts-ignore
    return meResolver(parent, args, context, info)
}