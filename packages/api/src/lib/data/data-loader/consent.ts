import {BatchLoadFn} from "dataloader";
import {Consent} from "@prisma/client";
import {GqlError} from "../../../generated/graphql";
import {prismaDb} from "../data";

export const consentsForUserIdBatchLoader: BatchLoadFn<string, Array<Consent>> = async (ids) => {

    const result = [];
    for(let i = 0; i < ids.length; i++) {
        const userId = ids[i];

        try {
            const consents = await prismaDb.consent.findMany({
                where: {
                    userId
                }
            })
            result.push(consents)
        } catch {
            result.push(new Error(GqlError.DbError))
        }
    }
    return result;
}