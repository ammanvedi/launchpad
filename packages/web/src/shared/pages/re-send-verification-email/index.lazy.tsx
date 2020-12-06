import Loadable from 'react-loadable';
import React from 'react';

export const ReSendVerificationLazy = Loadable({
    loader: () => import(/* webpackChunkName: "resend-verification" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
