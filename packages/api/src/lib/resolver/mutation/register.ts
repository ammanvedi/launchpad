import {MutationResolvers} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {createLoggerSet} from "../../logging/logger";
import { v4 as uuidv4 } from 'uuid';
import {GqlError} from "../../../generated/graphql";
import {ConsentType} from '@prisma/client'

const log = createLoggerSet('RegisterResolver')

export const registerResolver: MutationResolvers<GQLContext>['register'] =
    async (parent, args, context) => {

    if (!args.user) {
        throw new Error(GqlError.InvalidArguments);
    }
    /**
     * Generate a proposal id for the user
     */
    const proposedId = uuidv4();

    const {
        email,
        password,
        lastName,
        firstName,
        bio,
        role,
    } = args.user;

    /**
     * Attempt to create a user in cognito land
     */
    let signUpResult;
    try {
        signUpResult = await context.amplifyAuth.signUp({
            username: email,
            password,
            attributes: {
                'custom:role': role,
                'custom:internalId': proposedId
            }
        });
    } catch (e) {
        log.err('Failed to create the user in cognito');
        log.err(e.toString());
        throw new Error(GqlError.CognitoCreationFailed);
    }

    /**
     * If we were able to create the cognito user lets now create
     * an internal user with the rest of the data
     */

    try {
        await context.data.db.user.create({data: {
                id: proposedId,
                externalId: signUpResult.userSub,
                role,
                bio,
                lastName,
                firstName,
                consents: {
                    create: [
                        {
                            consentedTo: ConsentType.PRIVACY_POLICY,
                        },
                        {
                            consentedTo: ConsentType.TERMS_OF_USE,
                        }
                    ]
                }
            }});
    } catch (e) {
        log.err('Failed to create user and consents');
        log.err(e.toString());
        throw new Error(GqlError.DbError);
    }

    return true;
}