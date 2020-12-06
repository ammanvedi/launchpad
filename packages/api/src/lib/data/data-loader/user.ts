import DataLoader from "dataloader";
import {User} from "@prisma/client";
import {GqlError} from "../../../generated/graphql";
import {alignResponsesToBatchKeys} from "../helpers";
import {prismaDb} from "../data";

export const userBatchLoader: DataLoader.BatchLoadFn<string, User> = async (ids) => {
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