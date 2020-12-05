import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import favicon from '../shared/assets/favicon.png';
import { ReactComponent as ReactLogo } from './assets/react.svg';
import routes from './routes';
import css from './App.module.css';

import SignUp from "pages/sign-up";
import SignUpVerify from "pages/sign-up-verify";
import SocialSignUp from 'pages/social-sign-up';
import Home from './pages/Home';
import { SignInAsync } from 'pages/sign-in/index.lazy';
import {ProfileLazy} from "pages/profile/index.lazy";

const App: React.FC<any> = () => {
    const { t } = useTranslation();
    return (
        <div className={css.wrapper}>
            <Helmet
                defaultTitle="Launchpad"
                titleTemplate="%s – Launchpad"
                link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
            />
            <h1>
                <ReactLogo className={css.reactLogo} /> Launchpad
            </h1>
            <Switch>
                <Route exact path={routes.home} component={Home} />
                <Route exact path={routes.signIn} component={SignInAsync} />
                <Route exact path={routes.socialSignUp} component={SocialSignUp} />
                <Route exact path={routes.signUp} component={SignUp} />
                <Route exact path={routes.signUpVerify} component={SignUpVerify} />
                <Route exact path={routes.profile} component={ProfileLazy} />
                <Route render={() => '404!'} />
            </Switch>
            <h2>{t('router-headline')}</h2>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/sign-in">Sign In</Link>
                </li>
                <li>
                    <Link to="/sign-up">Sign Up</Link>
                </li>
            </ul>
        </div>
    );
};

export default App;
