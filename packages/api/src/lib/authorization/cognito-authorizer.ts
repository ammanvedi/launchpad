import { AuthState, AuthTokens, IAuthorizer } from './IAuthorizer';
import { decodeIdToken, JWKData, jwtSignatureIsValid } from './jwt';
import { createLoggerSet } from '../logging/logger';
import { Role } from '../../generated/graphql';
import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import { urlEncodeObject } from './helper';
import { sign } from 'jsonwebtoken';

export type CognitoAuthorizerConfig = {
    iss: string;
    aud: string;
    cognito: AWS.CognitoIdentityServiceProvider;
    userPoolId: string;
    jwkUrl: string;
    clientId: string;
    signInCallbackUrl: string;
    oauthDomain: string;
};

export type CognitoIdToken = {
    sub: string;
    aud: string;
    email_verified: boolean;
    event_id: string;
    token_use: 'id';
    auth_time: number;
    iss: string;
    'cognito:username': string;
    exp: number;
    'custom:role': Role;
    'custom:internalId': string;
    iat: number;
    email: string;
};

type AWSTokensResponse = {
    id_token: string;
    access_token: string;
    refresh_token: string;
};

export class CognitoAuthorizer
    implements IAuthorizer<CognitoAuthorizerConfig, CognitoIdToken> {
    private jwk: JWKData<'RSA'> | null = null;

    private log = createLoggerSet('CognitoAuthorizer');

    private static readonly nullAuthState: AuthState = {
        id: '',
        role: '',
        email: '',
        externalUsername: '',
        sub: '',
        tokenExpiresAtUtcSecs: 0,
    };

    constructor(private readonly config: CognitoAuthorizerConfig) {}

    async refreshTokens({ refreshToken }: AuthTokens): Promise<AuthTokens | null> {
        const tokenUrl = `https://${this.config.oauthDomain}/oauth2/token`;
        const refreshRedacted = `${refreshToken.substr(0, 5)}-xxx-xxx`;

        this.log.info(`Exchanging refresh token ${refreshRedacted} for tokens`);

        const body = urlEncodeObject({
            client_id: this.config.clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });

        try {
            const result: AWSTokensResponse = await fetch(tokenUrl, {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then((res) => res.json());

            return {
                idToken: result.id_token,
                accessToken: result.access_token,
                refreshToken: result.refresh_token,
            };
        } catch (e) {
            this.log.err(
                `Failed to exchange refresh token for tokens ${refreshRedacted} for token`,
            );
            this.log.err(e);
            return null;
        }
    }

    async signIn(username: string, password: string): Promise<AuthTokens | null> {
        try {
            const signInResult = await this.config.cognito
                .adminInitiateAuth({
                    AuthFlow: 'ADMIN_NO_SRP_AUTH',
                    AuthParameters: {
                        USERNAME: username,
                        PASSWORD: password,
                    },
                    ClientId: this.config.clientId,
                    UserPoolId: this.config.userPoolId,
                })
                .promise();

            const accessToken = signInResult.AuthenticationResult?.AccessToken;
            const idToken = signInResult.AuthenticationResult?.IdToken;
            const refreshToken = signInResult.AuthenticationResult?.RefreshToken;
            if (accessToken && idToken && refreshToken) {
                return {
                    idToken,
                    accessToken,
                    refreshToken,
                };
            }

            this.log.err('Response for sign in contained incomplete token set');

            return null;
        } catch (e) {
            this.log.err('Failed to sign user in');
            this.log.err(e);
            return null;
        }
    }

    async exchangeCodeForTokens(code: string): Promise<AuthTokens | null> {
        const tokenUrl = `https://${this.config.oauthDomain}/oauth2/token`;
        const codeRedacted = `${code.substr(0, 5)}-xxx-xxx`;

        this.log.info(`Exchanging code ${codeRedacted} for tokens`);

        const body = urlEncodeObject({
            client_id: this.config.clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.config.signInCallbackUrl,
        });

        console.log(body);

        try {
            const result: AWSTokensResponse = await fetch(tokenUrl, {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then((res) => res.json());

            console.log(result);

            // @ts-ignore
            if (result.error) {
                this.log.err(
                    `Failed to exchange code ${codeRedacted} for token, request succeeded but returned error`,
                );
                // @ts-ignore
                this.log.err(result.error);
                return null;
            }

            return {
                idToken: result.id_token,
                accessToken: result.access_token,
                refreshToken: result.refresh_token,
            };
        } catch (e) {
            this.log.err(`Failed to exchange code ${codeRedacted} for token`);
            this.log.err(e);
            return null;
        }
    }

    determineAccessTokenExpiryUTC(token: string): string {
        throw new Error('Method not implemented.');
    }

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

    public validateToken(accessToken: string): CognitoIdToken | false {
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

            if (!issuerValid) {
                this.log.err('Token issuer invalid');
                return false;
            }

            const audValid = this.isAudValid(decodedToken.aud);

            if (!audValid) {
                this.log.err('Token aud invalid');
                return false;
            }

            const expValid = this.isExpiryValid(decodedToken.exp);

            if (!expValid) {
                this.log.err('Token exp invalid');
                return false;
            }

            return decodedToken;
        } catch (e) {
            this.log.err(`Something went wrong validating token, ${e}`);
            return false;
        }
    }

    public getAuthState(tokens: AuthTokens | null): AuthState {
        if (!tokens) {
            this.log.warn('Token set was null');
            return CognitoAuthorizer.nullAuthState;
        }

        if (!tokens.idToken) {
            this.log.warn('Rejected incomplete token set');
            return CognitoAuthorizer.nullAuthState;
        }
        const tokenValidated = this.validateToken(tokens.idToken);

        if (!tokenValidated) {
            this.log.warn('rejected invalid token');
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
            tokenExpiresAtUtcSecs: tokenValidated.exp,
        };
    }

    linkExternalUserToInternalUser(
        externalId: string,
        internalId: string,
        role: Role,
    ): Promise<void> {
        return new Promise((res, rej) => {
            const params = {
                UserAttributes: [
                    {
                        Name: 'custom:internalId',
                        Value: internalId,
                    },
                    {
                        Name: 'custom:role',
                        Value: role,
                    },
                ],
                UserPoolId: this.config.userPoolId,
                Username: externalId,
            };
            this.config.cognito.adminUpdateUserAttributes(params, (err, data) => {
                if (err) {
                    this.log.err('Failed to link external user');
                    this.log.err(err.toString());
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }

    async initialize(): Promise<void> {
        try {
            const result = await fetch(this.config.jwkUrl);
            const jwkJson = (await result.json()) as JWKData<'RSA'>;
            this.log.info('Did fetch JWK keys');
            this.jwk = jwkJson;
        } catch (e) {
            this.log.err('Initialisation of cognito authorizer failed');
            this.log.err(e.toString());
        }
    }
}
