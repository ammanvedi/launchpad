import {IAuthorizer} from "./IAuthorizer";

import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem'
import fetch from 'node-fetch';

type CognitoAuthorizerConfig = {
    jwkUrl: string
}

type CognitoJWKData = {
    keys: Array<{
        alg: string,
        e: string,
        kid: string,
        kty: string,
        n: string,
        use: string
    }>
}

/**
 * 1. check which jwk is needed to verify with SO link
 */

export class CognitoAuthorizer implements IAuthorizer<CognitoAuthorizerConfig> {

    config: CognitoAuthorizerConfig | null = null;
    jwkData: CognitoJWKData | null = null;
    jwkPem: String | null = null;

    public async initialize(config: CognitoAuthorizerConfig): Promise<void> {
        this.config = config;
        this.jwkData = await this.getJWKData();
        if (this.jwkData) {
            this.jwkPem = jwkToPem(this.jwkData)
        }

    }

    public validateToken(token: string): boolean {
        return false;
    }

    private async getJWKData(): Promise<CognitoJWKData | null> {
        if (!this.config) {
            console.error('Cant fetch JWK data as there is no config, has initialize() been called?');
            return null;
        }

        if (!this.config?.jwkUrl) {
            console.error('Cant fetch JWK data as there is no jwkUrl in config');
            return null;
        }

        const result = await fetch(this.config?.jwkUrl).then(res => res.json());

        console.log(result)

        return result as CognitoJWKData;

    }

}