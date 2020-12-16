import loadable from '@loadable/component';

export const ProfileLazy = loadable(
    () => import(/* webpackChunkName: "profile" */ './index'),
);
