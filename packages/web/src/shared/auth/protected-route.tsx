import React from 'react';
import {Route, RouteProps, Redirect} from "react-router-dom";
import routes from "routes";

type ProtectedRouteProps = {
    children: React.ReactNode,
    sendUnauthorisedTo: string,
} & Omit<RouteProps, 'render'>;

export const ProtectedRoute = ({
    sendUnauthorisedTo = routes.signIn,
    component: Component,
    ...routeProps
}: ProtectedRouteProps) => {

    return (
        <Route {...routeProps} render={routeProps => {
            const {staticContext} = routeProps

            if (!staticContext && typeof window === 'undefined') {
                /**
                 * We are now rendering on the client side
                 * we need to check if the user is logged in
                 * we need to do this synchronously so we attempt to
                 * read user tokens from document Cookie
                 * TODO
                 */
            }
            /**
             * When we render on the server side, in the file
             * src/server/middleware/serverRenderer.tsx
             * we set a context of weather a user is logged in
             * based on if they have the correct cookie set
             */
            // @ts-ignore
            if(!staticContext?.isLoggedIn) {
                return (
                    <Redirect to={sendUnauthorisedTo} />
                )
            }

            // @ts-ignore
            return <Component {...routeProps} />
        }} />
    )
}