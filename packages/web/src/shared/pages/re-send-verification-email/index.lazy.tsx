import loadable from '@loadable/component';

export const ReSendVerificationLazy = loadable(
    () => import(/* webpackChunkName: "resend-verification" */ './index'),
);
