import DataLoader from "dataloader";
import {Consent, PrismaClient, User} from '@prisma/client';
import {userBatchLoader} from "./data-loader/user";
import {consentsForUserIdBatchLoader} from "./data-loader/consent";


export type DataLoaders = {
    user: {
        byId: DataLoader<string, User>
    },
    consents: {
        forUserId: DataLoader<string, Array<Consent>>
    }
}

export const prismaDb = new PrismaClient();


export const loaders = (): DataLoaders => ({
    user: {
        byId: new DataLoader(userBatchLoader)
    },
    consents: {
        forUserId: new DataLoader(consentsForUserIdBatchLoader)
    }
})