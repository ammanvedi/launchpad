import {GqlError, MutationResolvers, Role} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {ConsentType} from '@prisma/client';
import {getPrismaError} from "../../error/error";

export const addConsentResolver: MutationResolvers<GQLContext>['addConsent'] =
    async (parent, args, {authState, data}, info) => {

    try {
        const updatedUser = await data.db.user.update({
            where: {
                id: authState.id
            },
            include: {
                consents: true
            },
            data: {
                consents: {
                    create: [
                        {
                            consentedTo: (args.type as ConsentType)
                        }
                    ]
                }
            }
        });

        data.loaders.user.byId.prime(authState.id, updatedUser);
        data.loaders.consents.forUserId.prime(authState.id, updatedUser.consents)

    } catch (e) {
        throw getPrismaError(e.code)
    }

    return {
        user: {
            id: authState.id,
            role: authState.role as Role,
            email: authState.email,
        }
    }
}