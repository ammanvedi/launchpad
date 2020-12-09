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
import {ReSendVerificationLazy} from "pages/re-send-verification-email/index.lazy";
import {ForgotPassswordLazy} from "pages/forgot-password/index.lazy";
import {SetNewPasswordLazy} from "pages/set-new-password/index.lazy";

const App: React.FC<any> = () => {
    const { t } = useTranslation();
    return (
        <div className={css.wrapper}>
            <Helmet
                defaultTitle="Launchpad"
                titleTemplate="%s – Launchpad"
                link={[{ rel: 'shortcut icon', type: 'image/png', href: favicon }]}
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
                <Route exact path={routes.resendVerification} component={ReSendVerificationLazy} />
                <Route exact path={routes.forgotPassword} component={ForgotPassswordLazy} />
                <Route exact path={routes.setNewPassword} component={SetNewPasswordLazy} />
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
                <li>
                    <Link to="/sign-up-verify">Verify Sign Up</Link>
                </li>
                <li>
                    <Link to="/me">Profile (requires authorisation)</Link>
                </li>
                <li>
                    <Link to={routes.resendVerification}>Re send verification email</Link>
                </li>
                <li>
                    <Link to={routes.forgotPassword}>Forgot password</Link>
                </li>
                <li>
                    <Link to={routes.setNewPassword}>Set new password</Link>
                </li>
            </ul>
        </div>
    );
};

export default App;
