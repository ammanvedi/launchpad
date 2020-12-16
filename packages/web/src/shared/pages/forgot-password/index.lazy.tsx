import loadable from '@loadable/component';

export const ForgotPassswordLazy = loadable(
    () => import(/* webpackChunkName: "forgot-password" */ './index'),
);
