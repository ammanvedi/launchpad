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

import { DeploymentTrigger, DigitalOceanService } from './digital-ocean';
import { log } from './log';
import { ConfigReader, TFVarsReader } from './tfvars-reader';

log.info('Showing environment');
log.info(
    JSON.stringify(
        {
            hasDoToken: !!process.env.DO_TOKEN,
            applicationNameTfVar: process.env.APPLICATION_NAME_TFVAR,
            TfVarsPath: process.env.TFVARS_PATH,
        },
        null,
        2,
    ),
);

const trigger: DeploymentTrigger = new DigitalOceanService(process.env.DO_TOKEN);
const varReader: ConfigReader = new TFVarsReader();

varReader.loadVars(process.env.TFVARS_PATH);
const appName = varReader.getVar(process.env.APPLICATION_NAME_TFVAR);

console.log(appName);

if (!appName) {
    log.error('Failed to retrieve the app name from tfVars');
}

trigger
    .triggerDeployment(appName)
    .then(() => {
        log.success('Application was deployed');
    })
    .catch((e: Error) => {
        log.error('Application failed to deploy');
        log.error(e.toString());
        log.error(e.stack);
    });
