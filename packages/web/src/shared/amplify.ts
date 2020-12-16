export const amplifyConfig = {
    aws_project_region: process.env.TF_VAR_aws_region,
    aws_cognito_region: process.env.TF_VAR_aws_region,
    aws_user_pools_id: process.env.TF_VAR_aws_user_pool_id,
    aws_user_pools_web_client_id: process.env.TF_VAR_aws_user_pool_client_id,
    oauth: {
        domain: `${process.env.TF_VAR_user_pool_domain}.auth.${process.env.TF_VAR_aws_region}.amazoncognito.com`,
        scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: process.env.TF_VAR_sign_in_callback_url,
        redirectSignOut: process.env.TF_VAR_sign_out_callback_url,
        responseType: 'code',
    },
    federationTarget: 'COGNITO_USER_POOLS',
};

export const amplifyAuthConfig = {
    region: process.env.TF_VAR_aws_region,
    userPoolId: process.env.TF_VAR_aws_user_pool_id,
    userPoolWebClientId: process.env.AWS_USER_POOLS_WEB_CLIENT_ID,
    cookieStorage: {
        domain: process.env.TF_VAR_auth_cookie_domain,
        path: process.env.TF_VAR_auth_cookie_path,
        expires: parseInt(process.env.TF_VAR_auth_cookie_expiry_days || '365'),
        secure: JSON.parse(process.env.TF_VAR_auth_cookie_secure || ''),
    },
};

export const COGNITO_URL = `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/`;
