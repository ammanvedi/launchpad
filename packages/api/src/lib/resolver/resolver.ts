import { Resolvers } from '../../generated/graphql';
import { GQLContext } from '../context/context';
import { meResolver } from './query/me';
import { userFieldsResolver } from './field/user';
import { registerResolver } from './mutation/register';
import { registerUserFromExternalProviderResolver } from './mutation/register-user-from-external-provider';
import { updateUserProfileImageResolver } from './mutation/update-user-profile-image';
import { addConsentResolver } from './mutation/add-consent';
import { signInResolver } from './mutation/sign-in';
import { refreshTokensResolver } from './mutation/refresh-tokens';
import { signOutResolver } from './mutation/sign-out';
import { registerResendVerificationEmailResolver } from './mutation/register-resend-verification-email';
import { registerVerifyEmailResolver } from './mutation/register-verify-email';
import { forgotPasswordCompleteResolver } from './mutation/forgot-password-complete';
import { forgotPasswordBeginResolver } from './mutation/forgot-password-begin';
import { setPasswordResolver } from './mutation/set-password';
import { changeEmailBeginResolver } from './mutation/change-email-begin';
import { changeEmailCompleteResolver } from './mutation/change-email-complete';

export const resolvers: Resolvers<GQLContext> = {
    Query: {
        me: meResolver,
        helloWorld: () => {
            return {
                hello: 'World',
            };
        },
    },
    Mutation: {
        addConsent: addConsentResolver,
        register: registerResolver,
        registerUserFromExternalProvider: registerUserFromExternalProviderResolver,
        updateUserProfileImage: updateUserProfileImageResolver,
        signIn: signInResolver,
        refreshTokens: refreshTokensResolver,
        signOut: signOutResolver,
        registerResendVerificationEmail: registerResendVerificationEmailResolver,
        registerVerifyEmail: registerVerifyEmailResolver,
        forgotPasswordBegin: forgotPasswordBeginResolver,
        forgotPasswordComplete: forgotPasswordCompleteResolver,
        setPasswordComplete: setPasswordResolver,
        changeEmailBegin: changeEmailBeginResolver,
        changeEmailComplete: changeEmailCompleteResolver,
    },
    User: userFieldsResolver,
};
