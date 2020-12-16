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
launchpad-development-2.auth.eu-west-1.amazoncognito.com/oauth/idpresponse

install terraform
