import Loadable from 'react-loadable';
import React from 'react';

export const PageOneAsync = Loadable({
    loader: () => import(/* webpackChunkName: "page-one" */ './index'),
    loading() {
        return <div>LOOOOADING</div>;
    },
});
