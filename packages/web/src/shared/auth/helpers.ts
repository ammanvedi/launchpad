import { Response } from 'express';
import Cookies from 'universal-cookie';
import { amplifyAuthConfig, COGNITO_URL } from 'amplify';
import fetch from 'node-fetch';

type CookieType = 'idToken' | 'refreshToken' | 'accessToken';

export const getTokenTypeRegex = (type: CookieType, clientId: string): RegExp => {
    return new RegExp(
        `CognitoIdentityServiceProvider\\.${clientId}\\.[0-9a-z\\-_A-Z]+\\.${type}`,
    );
};

export const getTokenTypeFromRequest = (
    cookiesData: Cookies,
    type: CookieType,
    clientId: string,
): string | null => {
    const desiredRegex = getTokenTypeRegex(type, clientId);
    const cookies = cookiesData.getAll();
    const cookieNames = Object.keys(cookies);
    const desiredCookie = cookieNames.find((name) => desiredRegex.test(name));
    if (desiredCookie) {
        // @ts-ignore
        return cookies[desiredCookie];
    }
    return null;
};

/**
 * Check if the user has an idToken in their cookies, if they do
 * then we assert that they are logged in and that authenticated requests
 * should succeed
 *
 * cookieString should be equivalent to document.cookie
 */
export const isLoggedInSync = (
    cookieString: string,
    tokenType: CookieType = 'idToken',
    clientId: string = process.env.TF_VAR_aws_user_pool_client_id || '',
): boolean => {
    const idTokenRegex = getTokenTypeRegex(tokenType, clientId);
    return idTokenRegex.test(cookieString);
};

const generateCookieName = (
    username: string, // e.g. adb95c47-ed10-41e6-84f1-ad4697040f6e
    clientId: string, // e.g. 64r8amojc8k3col1e616srig01
    type: CookieType,
): string => {
    return `CognitoIdentityServiceProvider.${clientId}.${username}.${type}`;
};

type CookieData = {
    name: string;
    value: string;
};

export const generateCookies = (
    { AuthenticationResult: { AccessToken, IdToken, RefreshToken } }: ManualTokenResponse,
    clientId: string,
    username: string,
): Array<CookieData> => {
    const nameGen = generateCookieName.bind(null, username, clientId);

    const c = [
        {
            name: nameGen('accessToken'),
            value: AccessToken,
        },
        {
            name: nameGen('idToken'),
            value: IdToken,
        },
    ];

    if (RefreshToken) {
        c.push({
            name: nameGen('refreshToken'),
            value: RefreshToken,
        });
    }

    return c;
};

// exp is unix time in seconds
export const tokenIsExpired = async (exp: number): Promise<boolean> => {
    const now = new Date().getTime() / 1000;
    return now > exp;
};

type ManualTokenResponse = {
    AuthenticationResult: {
        AccessToken: string;
        ExpiresIn: number;
        IdToken: string;
        RefreshToken: string;
        TokenType: string;
    };
};

export const manuallyRefreshTokens = async (
    refreshToken: string,
    clientId: string,
    url = COGNITO_URL,
): Promise<ManualTokenResponse | null> => {
    const body = JSON.stringify({
        ClientId: clientId,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        },
    });

    try {
        const result: ManualTokenResponse = await fetch(url, {
            method: 'post',
            body,
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            },
        }).then((res) => res.json());

        return result;
    } catch (e) {
        return null;
    }
};

export const setAuthCookies = (res: Response, cookies: Array<CookieData>): void => {
    cookies.forEach(({ name, value }) => {
        res.cookie(name, value, {
            ...amplifyAuthConfig.cookieStorage,
            expires: getExpires(amplifyAuthConfig.cookieStorage.expires),
        });
    });
};

export const getExpires = (days: number) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
};
