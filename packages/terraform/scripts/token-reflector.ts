import { GithubService, SecretUpdater } from './github';
import { DigitalOceanService, EncryptedTokenStore } from './digital-ocean';
import { log } from './log';
import { ConfigReader, TFVarsReader } from './tfvars-reader';

/**
 * Terraform works on a basis of comparing the action that you would like to take to the
 * state of the real world. Because of this difficulties will arise from time to time
 * when external services perform any transformations on the inputs we give them. As this
 * would immediately lead to the state of the real world differing from the desired state
 * immediately after it was applied.
 *
 * Logically this will lead to the state being refreshed every time we make a change,
 * regardless of if we changed that specific piece of the infrastructure. The knock on effect
 * of this can be the infrastructure re-deploying when it does not need to, which is a waste
 * of resources.
 *
 * Well we have a situation like this when it comes to secret storage in digital ocean.
 * When we send a plaintext value of a secret environment variable to digital ocean it will
 * take this value and encrypt it. taking it from that value to a string looking like
 *
 * EV:[daksdjadjlad.....
 *
 * now this means that the next time we try to set the secret, as described earlier we will
 * see a diff in terraform that is not the result of us making an actual change but
 * is rather a reflection of this problem.
 *
 * So we need to combat this somehow and we do have a few options that we need to evaluate
 *
 * 1. ignore the changes
 * This is potentially a good solution, we use terraform to set the envar once
 * and then we manage it in the digitalocean console ourselves after that.
 * Although a downside is that its just one more place we can forget to update it
 * should it change. However unfortunately there is an issue open for this at time of
 * writing that prevents us setting these envars to be ignored
 *
 * https://github.com/hashicorp/terraform/issues/26359
 *
 * 2. store the value unencrypted
 * This would solve the issue in the sense that digital ocean would not perform any encryption
 * and the value would be stored as is, so it is tempting, however its very bad practice
 * so we will pretend we were never tempted
 *
 * 3. deal with the re creation of resources
 * We could just allow the change to be made and deal with the fact that our application
 * will have a new image spun up. But this also feels like bad practice since we are
 * wasting resources for no reason so we want to avoid this also
 *
 * 4. encrypt the value ourselves
 * This initially sounded like a good idea to me, we dont use the DO encryption but instead we
 * encrypt the value ourselves and we decrypt it in the app, but in order to tell the app
 * how to decrypt that information we would have to pass it a key, or an api key if we were
 * to use something like Hashicorp Vault, so really we dont avoid using secrets, which means
 * we would again have the same problem. So we can bin this brain fart
 *
 * 5. reflect the encrypted token
 * Save the most acceptable till last. What we can do is follow this process
 * 1. Set plaintext secret name via a github repository secret
 * 2. apply changes to digital ocean infrastructure
 * 3. pull the encrypted secret from the digital ocean api
 * 4. update the github environment variable
 *
 * The downside here is that we will need a separate environment variable to pass secrets to
 * digital ocean in order to not affect other services that dont need this behaviour. For
 * me this is acceptable. And I plant to make it manageable via documentation. And if you are
 * reading this right now it means I stayed true to my word on that one.
 *
 * The purpose of this code is to perform that reflection
 *
 * See some discussion about this here
 * https://www.digitalocean.com/community/questions/how-to-use-environment-values-of-type-secret-on-following-submissions
 */

const reflectTokens = async (
    serviceName: string,
    repoName: string,
    tokenStore: EncryptedTokenStore,
    secretUpdater: SecretUpdater,
) => {
    const alreadyEncryptedTokens = await tokenStore.getEncryptedTokensForService(
        serviceName,
    );

    for (const tokenName in alreadyEncryptedTokens) {
        if (alreadyEncryptedTokens.hasOwnProperty(tokenName)) {
            const tokenVal = alreadyEncryptedTokens[tokenName];
            // Github converts envars to uppercase so lets do that also
            const ghTokenName = `${process.env.SECRETS_PREFIX}${tokenName}${process.env.SECRETS_POSTFIX}`.toUpperCase();
            log.info(
                `Token from DO named ${tokenName} will be reflected into github token ${ghTokenName}`,
            );
            try {
                log.info('attempting to update secret');
                await secretUpdater.updateSecret(repoName, ghTokenName, tokenVal);
                log.success(`Did update secret`);
            } catch (e) {
                log.error('failed to update secret');
                log.error(e.toString());
                log.error(e.stack);
            }
        }
    }
};

const varReader: ConfigReader = new TFVarsReader();

varReader.loadVars(process.env.TFVARS_PATH);
const appName = varReader.getVar(process.env.APPLICATION_NAME_TFVAR);
const repoName = varReader.getVar(process.env.APPLICATION_REPO_NAME_TFVAR);

log.info('Show environment');
log.info(
    JSON.stringify(
        {
            haveDoToken: !!process.env.TF_VAR_do_token,
            appName,
            haveGHToken: !!process.env.TF_VAR_github_personal_access_token,
            repoName,
            secretsPrefix: process.env.SECRETS_PREFIX,
            secretsPostfix: process.env.SECRETS_POSTFIX,
        },
        null,
        2,
    ),
);

reflectTokens(
    appName,
    repoName,
    new DigitalOceanService(process.env.TF_VAR_do_token),
    new GithubService(process.env.TF_VAR_github_personal_access_token),
);
