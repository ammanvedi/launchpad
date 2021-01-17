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
    },
    User: userFieldsResolver,
};
