import {AuthState, AuthTokens, IAuthorizer} from "./IAuthorizer";
import jwkToPem from 'jwk-to-pem'
import fetch from 'node-fetch';
import {decodeIdToken, JWKData, jwtSignatureIsValid} from "./jwt";
import {createLogger, createLoggerSet} from "../logging/logger";
import {Role} from "../../generated/graphql";

export type CognitoAuthorizerConfig = {
    jwk: JWKData<'RSA'>
}

export type CognitoIdToken = {
    sub: string,
    aud: string,
    email_verified: boolean,
    event_id: string,
    token_use: 'id',
    auth_time: number,
    iss: string,
    'cognito:username': string,
    exp: number,
    'custom:role': Role,
    'custom:internalId': string,
    iat: number,
    email: string,
}


export class CognitoAuthorizer implements IAuthorizer<CognitoAuthorizerConfig> {

    private log = createLoggerSet('CognitoAuthorizer');

    private static readonly nullAuthState: AuthState = {
        id: '',
        role: '',
        email: '',
    }

    constructor(private iss: string, private aud: string, private readonly config: CognitoAuthorizerConfig) {
    }

    private isIssuerValid(iss: string): boolean {
        return iss === this.iss;
    }

    private isAudValid(aud: string): boolean {
        return aud === this.aud;
    }

    private isExpiryValid(exp: number): boolean {
        const now = new Date().getTime() / 1000;
        return exp > now;
    }

    public validateToken(accessToken: string): boolean {
        if (!this.config.jwk) {
            this.log.warn('Attempted token validation when no JWK data was available');
            return false;
        }
        try {
            const signatureValid = jwtSignatureIsValid(accessToken, this.config.jwk);

            if (!signatureValid) {
                this.log.err('The jwt signature could not be verified');
                return false;
            }

            const decodedToken = decodeIdToken<CognitoIdToken>(accessToken);

            if (!decodedToken) {
                this.log.err('Could not decode id token when trying to validate');
                return false;
            }

            const issuerValid = this.isIssuerValid(decodedToken.iss);

            if(!issuerValid) {
                this.log.err('Token issuer invalid');
                return false;
            }

            const audValid = this.isAudValid(decodedToken.aud);

            if(!audValid) {
                this.log.err('Token aud invalid');
                return false;
            }

            const expValid = this.isExpiryValid(decodedToken.exp);

            if(!expValid) {
                this.log.err('Token exp invalid');
                return false;
            }

            return true;

        } catch (e) {
            this.log.err(`Something went wrong validating token, ${e}`);
            return false;
        }

    }

    public getAuthState(tokens: AuthTokens): AuthState {

        if (!tokens.idToken) {
            this.log.warn('Rejected incomplete token set')
            return CognitoAuthorizer.nullAuthState;
        }
        const tokenValid = this.validateToken(tokens.idToken);

        if(!tokenValid) {
            this.log.warn('rejected invalid token')
            return CognitoAuthorizer.nullAuthState;
        }

        this.log.info('Token validated');

        const decodedIdToken = decodeIdToken<CognitoIdToken>(tokens.idToken);

        if (!decodedIdToken) {
            return CognitoAuthorizer.nullAuthState;
        }

        return {
            id: decodedIdToken['custom:internalId'],
            role: decodedIdToken['custom:role'],
            email: decodedIdToken['email'],
        }


    }

}