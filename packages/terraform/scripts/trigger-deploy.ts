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
import { log } from './log';

log.info('Showing environment');
log.info(
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
        log.success('Application was deployed');
    })
    .catch((e: Error) => {
        log.error('Application failed to deploy');
        log.error(e.toString());
        log.error(e.stack);
    });
