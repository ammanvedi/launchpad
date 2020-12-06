import Loadable from 'react-loadable';
import React from 'react';

export const ForgotPassswordLazy = Loadable({
    loader: () => import(/* webpackChunkName: "forgot-password" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
