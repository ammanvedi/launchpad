import {AuthTokens} from "./IAuthorizer";
import {IncomingHttpHeaders} from "http";


type Request = {headers: IncomingHttpHeaders};



export const getAuthTokens = (req: Request): AuthTokens => {
    const idToken = (req.headers['x-id-token'] as string) || null;
    const accessToken = (req.headers['x-access-token'] as string)|| null;

    return {
        idToken,
        accessToken
    }
}