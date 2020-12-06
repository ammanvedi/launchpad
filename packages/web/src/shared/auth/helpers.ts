import {Request} from "express";
import Cookies from "universal-cookie";

const idTokenRegex = /CognitoIdentityServiceProvider\.[0-9a-z]+\.[0-9a-z\-_A-Z]+\.idToken/


export const getIdTokenFromRequest = (req: Request): string | null => {
    const cookies = new Cookies(req.headers.cookie).getAll();
    const cookieNames = Object.keys(cookies);
    const idTokenCookie = cookieNames.find(name => idTokenRegex.test(name));
    if (idTokenCookie) {
        // @ts-ignore
        return cookies[idTokenCookie];
    }
    return null;
}

export const tokenIsExpired = async (token: string): Promise<boolean> => {
    const {decode} = await import('jsonwebtoken');
    const decodedCookieToken = decode(token);
    // @ts-ignore
    const expiry = decodedCookieToken?.exp
    if (expiry) {
        const now = new Date().getTime() / 1000;
        console.log(expiry, now, decodedCookieToken)
        return now > expiry;
    }
    return false;
}