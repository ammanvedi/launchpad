/**
 * Mapping of prisma error codes to internal graphql errors
 * for a full listing of prisma errors please see
 *
 * https://www.prisma.io/docs/concepts/components/prisma-client/error-reference
 */
import {GqlError} from "../../generated/graphql";

type PrismaErrorMapping = {
    [key: string]: GqlError
}

export const PrismaError: PrismaErrorMapping = {
    P2002: GqlError.EntryExists
}

export const getPrismaError = (code: string): Error => {
    return new Error(PrismaError[code] || GqlError.Unknown);
}