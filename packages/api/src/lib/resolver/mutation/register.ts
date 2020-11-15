import {MutationResolvers, Role} from "../../../generated/graphql";
import {GQLContext} from "../../context/context";
import {createLoggerSet} from "../../logging/logger";
import {Role as DBRole} from '@prisma/client'

const log = createLoggerSet('RegisterResolver')

export const registerResolver: MutationResolvers<GQLContext>['register'] =
    async (parent, args, context, info) => {

    if (!args.user) {
        throw new Error('No user args provided');
    }

    const {
        lastName,
        firstName,
        bio,
        role,
    } = args.user;

    const existingUser = await context.db.user.findFirst({
        where: {
            id: {
                equals: context.authState.id
            }
        }
    });

    if (existingUser) {
        throw new Error('User with ID already exists');
    }

    const newUser = await context.db.user.create({data: {
            id: context.authState.id,
            role: context.authState.role || DBRole.USER,
            bio,
            lastName,
            firstName,
        }})

    return {
        email: context.authState.email,
        ...newUser,
        role: newUser.role as Role
    };
}