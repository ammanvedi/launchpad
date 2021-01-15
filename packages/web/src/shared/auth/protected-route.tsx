import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import routes from 'routes';

type ProtectedRouteProps = {
    onConditionFailureSendUserTo?: string;
    grantAccess: () => boolean;
} & Omit<RouteProps, 'render'>;

export const ProtectedRoute = ({
    onConditionFailureSendUserTo = routes.signIn,
    component: Component,
    grantAccess,
    ...routeProps
}: ProtectedRouteProps) => {
    return (
        <Route
            {...routeProps}
            render={() => {
                if (grantAccess()) {
                    // @ts-ignore
                    return <Component />;
                }

                return <Redirect to={onConditionFailureSendUserTo} />;
            }}
        />
    );
};
