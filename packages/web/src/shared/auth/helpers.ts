import fetch from 'node-fetch';
import { AuthTokens, IdentityCookies, IdentityHeaders } from 'auth/types';

/**
 * Check if the user has an idToken in their cookies, if they do
 * then we assert that they are logged in and that authenticated requests
 * should succeed
 *
 * cookieString should be equivalent to document.cookie
 */
const loggedInCookieRegex = new RegExp(`${IdentityCookies.IsLoggedIn}=true`);
export const isLoggedInSync = (cookieString: string): boolean => {
    return loggedInCookieRegex.test(cookieString);
};

/**
 * Expiry is unix time in seconds
 */
export const tokenIsExpired = async (exp: number): Promise<boolean> => {
    const now = new Date().getTime() / 1000;
    return now > exp;
};

type ManualRefreshResponse = {
    didRefresh: boolean;
    setCookieHeader: string | null;
};

export const manuallyRefreshTokens = async (
    tokens: AuthTokens,
): Promise<ManualRefreshResponse | null> => {
    try {
        const body = JSON.stringify({
            operationName: null,
            variables: {},
            query: `
                mutation {
                    refreshTokens
                }
            `,
        });

        const result: ManualRefreshResponse | null = await fetch(
            process.env.TF_VAR_public_graphql_endpoint || '',
            {
                method: 'POST',
                body,
                headers: {
                    [IdentityHeaders.IdToken]: tokens.idToken,
                    [IdentityHeaders.AccessToken]: tokens.accessToken,
                    [IdentityHeaders.RefreshToken]: tokens.refreshToken,
                    'Content-Type': 'application/json',
                },
            },
        ).then(async (res) => {
            const json = await res.json();
            const cookieResponse = res.headers.get('set-cookie');
            return {
                didRefresh: json.data.refreshTokens,
                setCookieHeader: cookieResponse,
            };
        });

        return result;
    } catch {
        return null;
    }
};

export const getExpires = (days: number) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
};
