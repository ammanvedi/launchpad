export const amplifyConfig = {
    aws_project_region: process.env.TF_VAR_aws_region,
    aws_cognito_region: process.env.TF_VAR_aws_region,
    aws_user_pools_id: process.env.AWS_USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.AWS_USER_POOLS_WEB_CLIENT_ID,
    oauth: {
        domain: `${process.env.TF_VAR_user_pool_domain}.auth.${process.env.TF_VAR_aws_region}.amazoncognito.com`,
        scope:[
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        redirectSignIn: process.env.TF_VAR_sign_in_callback_url,
        redirectSignOut: process.env.TF_VAR_sign_out_callback_url,
        responseType: "code"
    },
    federationTarget :"COGNITO_USER_POOLS"
};

export const amplifyAuthConfig = {
    region: process.env.TF_VAR_aws_region,
        userPoolId: process.env.AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_USER_POOLS_WEB_CLIENT_ID,
    cookieStorage: {
        domain: process.env.AUTH_COOKIE_DOMAIN,
        path: process.env.AUTH_COOKIE_PATH,
        expires: parseInt(process.env.AUTH_COOKIE_EXPIRY_DAYS || '365'),
        secure: JSON.parse(process.env.AUTH_COOKIE_SECURE || '')
    }
}

export const COGNITO_URL = `https://cognito-idp.${process.env.TF_VAR_aws_region}.amazonaws.com/`;