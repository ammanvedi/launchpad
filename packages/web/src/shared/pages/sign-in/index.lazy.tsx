import Loadable from 'react-loadable';
import React from 'react';

export const SignInAsync = Loadable({
    loader: () => import(/* webpackChunkName: "page-one" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
