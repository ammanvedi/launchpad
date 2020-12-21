you will need to first install and configure the aws amplify cli

https://docs.amplify.aws/cli/start/install
setup .env
ln -f ./.env ./packages/web/.env
ln -f ./.env ./packages/api/.env
ln -f ./.env ./packages/terraform/.env
lerna bootstrap
lerna run amplify:push
lerna run dev

## https://<YOUR_DOMAIN>.auth.<REGION>.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=<REDIRECT_URI>&response_type=TOKEN&client_id=<CLIENT_ID>&scope=openid


lerna bootstrap --force-local && lerna link --force-local && lerna run prisma:generate && lerna run build --scope app

follow instructions here to enable sign in from various providers
https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html
your user pool domain will be
App Domain
https://<user_pool_domain>.auth.<aws_region>.amazoncognito.com
redirect uri
https://<user_pool_domain>.auth.<aws_region>.amazoncognito.com/oauth/idpresponse

for development you should make sure this matches the user_pool info in your .env
and for prod you should make sure it matches the user_pool info in your

link you github account to your digital ocean account before running terraform
https://cloud.digitalocean.com/apps/new

you dont have to actually create an app just get as far as linking github

install terraform
