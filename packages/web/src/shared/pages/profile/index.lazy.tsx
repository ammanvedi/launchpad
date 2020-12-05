import Loadable from 'react-loadable';
import React from 'react';

export const ProfileLazy = Loadable({
    loader: () => import(/* webpackChunkName: "profile" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
