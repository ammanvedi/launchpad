import {decode, verify} from "jsonwebtoken";
import jwkToPem from 'jwk-to-pem'

type JWTHeader = {
    typ: string,
    alg: string,
    kid: string,
}

export type JWK<ALG = string> = {
    alg: string,
    e: string,
    kid: string,
    kty: ALG,
    n: string,
    use: string
}

export type JWKData<ALG = string> = {
    keys: Array<JWK<ALG>>
}

export const getHeader = (jwt: string): JWTHeader | null => {
    const decoded = decode(jwt, {complete: true, json: true});
    return (decoded?.header as JWTHeader) || null;
}

export const getJWKByKeyId = <ALG = 'RSA'>(jwks: JWKData<ALG>, kid: string): JWK<ALG> | null => {
    return jwks.keys.find(jwk => jwk.kid === kid) || null;
}

export const jwtIsValid = (jwt: string, jwks: JWKData<'RSA'>): boolean | never => {
    const header = getHeader(jwt);

    if(!header || !header.kid) {
        throw new Error('Could not decode header of jwt');
    }

    const jwk = getJWKByKeyId(jwks, header.kid);

    if(!jwk) {
        throw new Error('Could not find the correct jwk');
    }

    const pem = jwkToPem(jwk);

    try {
        verify(jwt, pem, {algorithms: ['RS256']});
        return true;
    } catch {
        return false;
    }
}