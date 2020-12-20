/**
 * envars required
 *
 * TF_VAR_do_token
 * APPLICATION_NAME
 */

/**
 * trigger a deployment in the DO app that will pull latest master and
 * send the code on its way
 * We only have access to the app name in envars hence why we need to
 * do this in a script, to get the app id in an easier manner than through
 * the CLI
 */

import { DigitalOceanService } from './digital-ocean';

console.log('env');
console.log(
    JSON.stringify(
        {
            hasDoToken: !!process.env.TF_VAR_do_token,
            applicationName: process.env.APPLICATION_NAME,
        },
        null,
        2,
    ),
);

const digitalOcean = new DigitalOceanService(process.env.TF_VAR_do_token);

digitalOcean
    .triggerDeployment(process.env.APPLICATION_NAME)
    .then(() => {
        console.log('Success, Deployed');
    })
    .catch((e) => {
        console.log('Failed to create deployment');
        console.log(e);
    });
