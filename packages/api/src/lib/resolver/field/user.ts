import {ConsentType, GqlError, Resolvers, ResolversParentTypes} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {User, Consent} from '@prisma/client'


const baseFieldResolver =
    (baseField: Exclude<keyof Required<Resolvers<GQLContext>>['User'], 'email' | 'consents' | '__isTypeOf'>) =>
        async (parent: {id: string}, args: any, context: GQLContext) => {
    const u = await context.data.loaders.user.byId.load(parent.id)
    return u[baseField]
};

export const userFieldsResolver: Resolvers<GQLContext>['User'] = {
    firstName: baseFieldResolver('firstName'),
    lastName: baseFieldResolver('lastName'),
    bio: baseFieldResolver('bio'),
    profileImage: baseFieldResolver('profileImage'),
    consents: async (parent, args, context) => {
        let consents: Array<Consent> = [];
        try {
            consents = await context.data.db.consent.findMany({
                where: {
                    userId: parent.id
                }
            })
        } catch {
            throw new Error(GqlError.DbError)
        }

        return consents.map(c => ({
            ...c,
            id: c.id.toString(),
            timestamp: c.timestamp.toISOString(),
            consentedTo: c.consentedTo as ConsentType
        }));
    }
}