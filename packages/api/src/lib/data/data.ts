import DataLoader from "dataloader";
import {PrismaClient, User} from '@prisma/client';
import {GqlError} from "../../generated/graphql";
import {alignResponsesToBatchKeys} from "./helpers";

export type DataLoaders = {
    user: {
        byId: DataLoader<string, User>
    }
}

export const prismaDb = new PrismaClient();

const userBatchLoader: DataLoader.BatchLoadFn<string, User> = async (ids) => {
    const users = await prismaDb.user.findMany({
        where: {
            id: {
                in: (ids as Array<string>)
            }
        }
    });
    const errors = () => new Error(GqlError.UserDoesNotExist);
    return alignResponsesToBatchKeys(ids, users, errors)
}

export const loaders = (): DataLoaders => ({
    user: {
        byId: new DataLoader(userBatchLoader)
    }
})