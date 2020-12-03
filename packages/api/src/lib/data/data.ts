import DataLoader from "dataloader";
import {PrismaClient, User} from '@prisma/client';
import {GqlError} from "../../generated/graphql";

export type DataLoaders = {
    user: {
        byId: DataLoader<string, User>
    }
}

export const prismaDb = new PrismaClient();

type ObjectWithId<T = string> = {
    id: T
};

type KeyedObj<R extends Object, KEY = string> = {
    [key: string]: R
}

const arrayToObjectById = <
    R extends ObjectWithId<ID_TYPE>,
    ID_TYPE extends string | number
>(arr: Array<R>): KeyedObj<R, ID_TYPE> => {
    return arr.reduce((prev, curr, ix, arr) => {
        return {
            ...prev,
            [curr.id]: curr
        }
    }, {})
}

const alignResponsesToBatchKeys = <
    R extends ObjectWithId<ID_TYPE>,
    KEY_TYPE extends string | number,
    ID_TYPE extends string | number = string
>(
    keys: Readonly<Array<KEY_TYPE>>,
    responses: Array<R>,
    getError: (key: KEY_TYPE) => Error
): Array<R | Error> => {
    const mapped = arrayToObjectById(
        responses
    );

    return keys.map(key => {
        return mapped[key] || getError(key)
    })
}

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