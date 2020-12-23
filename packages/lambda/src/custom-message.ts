import { CustomMessageTriggerEvent } from 'aws-lambda/trigger/cognito-user-pool-trigger';
import { getSignUpEmail } from './email/sign-up';
import { getAdminCreateUserEmail } from './email/admin-create-user';
import { APP_NAME } from './constants';
import { getForgotPasswordEmail } from './email/forgot-password';
import { getMfaCodeEmail, getMfaCodeSms } from './email/mfa-code';
import { getUpdateUserAttributeEmail } from './email/update-user-attribute';
import {
    getVerifyUserAttributeEmail,
    getVerifyUserAttributeSms,
} from './email/verify-user-attribute';
import { Handler } from 'aws-lambda';

export const verificationEmail: Handler<
    CustomMessageTriggerEvent,
    CustomMessageTriggerEvent
> = async (evt, context, callback) => {
    const { codeParameter, usernameParameter } = evt.request;

    switch (evt.triggerSource) {
        case 'CustomMessage_ResendCode':
        case 'CustomMessage_SignUp':
            evt.response.emailSubject = `${APP_NAME} | Welcome`;
            evt.response.emailMessage = getSignUpEmail(codeParameter);
            break;
        case 'CustomMessage_AdminCreateUser':
            evt.response.emailSubject = `${APP_NAME} | Welcome`;
            evt.response.emailMessage = getAdminCreateUserEmail(
                usernameParameter,
                codeParameter,
            );
            break;
        case 'CustomMessage_ForgotPassword':
            evt.response.emailSubject = `${APP_NAME} | Forgotten Password`;
            evt.response.emailMessage = getForgotPasswordEmail(codeParameter);
            break;
        case 'CustomMessage_Authentication':
            evt.response.emailSubject = `${APP_NAME} | MFA Code`;
            evt.response.smsMessage = getMfaCodeSms(codeParameter);
            evt.response.emailMessage = getMfaCodeEmail(codeParameter);
            break;
        case 'CustomMessage_UpdateUserAttribute':
            evt.response.emailSubject = `${APP_NAME} | Update User Info`;
            evt.response.emailMessage = getUpdateUserAttributeEmail(codeParameter);
            break;
        case 'CustomMessage_VerifyUserAttribute':
            evt.response.emailSubject = '';
            evt.response.smsMessage = getVerifyUserAttributeSms(codeParameter);
            evt.response.emailMessage = getVerifyUserAttributeEmail(codeParameter);
            break;
    }

    callback(null, evt);

    return evt;
};
