import Loadable from 'react-loadable';
import React from 'react';

export const SetNewPasswordLazy = Loadable({
    loader: () => import(/* webpackChunkName: "set-new-password" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
