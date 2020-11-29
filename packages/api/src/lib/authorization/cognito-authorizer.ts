import {AuthState, AuthTokens, IAuthorizer} from "./IAuthorizer";
import {decodeIdToken, JWKData, jwtSignatureIsValid} from "./jwt";
import {createLoggerSet} from "../logging/logger";
import {Role} from "../../generated/graphql";
import AWS  from 'aws-sdk';
import fetch from 'node-fetch';

export type CognitoAuthorizerConfig = {
    iss: string,
    aud: string,
    cognito: AWS.CognitoIdentityServiceProvider,
    userPoolId: string,
    jwkUrl: string,
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

    private jwk: JWKData<'RSA'> | null = null;

    private log = createLoggerSet('CognitoAuthorizer');

    private static readonly nullAuthState: AuthState = {
        id: '',
        role: '',
        email: '',
        externalUsername: '',
        sub: ''
    }

    constructor(private readonly config: CognitoAuthorizerConfig) {}

    private isIssuerValid(iss: string): boolean {
        return iss === this.config.iss;
    }

    private isAudValid(aud: string): boolean {
        return aud === this.config.aud;
    }

    private isExpiryValid(exp: number): boolean {
        const now = new Date().getTime() / 1000;
        return exp > now;
    }

    public validateToken(accessToken: string): boolean {
        if (!this.jwk) {
            this.log.warn('Attempted token validation when no JWK data was available');
            return false;
        }
        try {
            const signatureValid = jwtSignatureIsValid(accessToken, this.jwk);

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
            // the internal id of the user
            id: decodedIdToken['custom:internalId'],
            role: decodedIdToken['custom:role'],
            email: decodedIdToken['email'],
            // for lookin up the user in the identity pool
            externalUsername: decodedIdToken['cognito:username'],
            // for uniquely identifying the user in the external pool
            sub: decodedIdToken.sub,
        }
    }

    linkExternalUserToInternalUser(externalId: string, internalId: string, role: Role): Promise<void> {

        return new Promise((res, rej) => {
            const params = {
                UserAttributes: [
                    {
                        Name: 'custom:internalId',
                        Value: internalId
                    },
                    {
                        Name: 'custom:role',
                        Value: role
                    },
                ],
                UserPoolId: this.config.userPoolId,
                Username: externalId,
            };
            this.config.cognito.adminUpdateUserAttributes(params, (err, data) => {
                if (err) {
                    this.log.err('Failed to link external user')
                    this.log.err(err.toString())
                    rej(err)
                } else {
                    res()
                }
            });

        })
    }

    async initialize(): Promise<void> {
        try {
            const result = await fetch(this.config.jwkUrl);
            const jwkJson = await result.json() as JWKData<'RSA'>;
            this.log.info('Did fetch JWK keys')
            this.jwk = jwkJson;
        } catch (e) {
            this.log.err('Initialisation of cognito authorizer failed');
            this.log.err(e.toString());
        }
    }

}