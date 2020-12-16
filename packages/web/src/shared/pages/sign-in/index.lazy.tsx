import loadable from '@loadable/component';

export const SignInAsync = loadable(
    () => import(/* webpackChunkName: "sign-in" */ './index'),
);
