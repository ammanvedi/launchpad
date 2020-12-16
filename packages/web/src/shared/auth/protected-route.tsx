import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import routes from 'routes';

type ProtectedRouteProps = {
    sendUnauthorisedTo?: string;
    isLoggedIn: () => boolean;
} & Omit<RouteProps, 'render'>;

export const ProtectedRoute = ({
    sendUnauthorisedTo = routes.signIn,
    component: Component,
    isLoggedIn,
    ...routeProps
}: ProtectedRouteProps) => {
    return (
        <Route
            {...routeProps}
            render={() => {
                if (isLoggedIn()) {
                    // @ts-ignore
                    return <Component />;
                }

                return <Redirect to={sendUnauthorisedTo} />;
            }}
        />
    );
};
