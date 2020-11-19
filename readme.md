you will need to first install and configure the aws amplify cli 

https://docs.amplify.aws/cli/start/install
setup .env
ln -f ./.env ./packages/app/.env
ln -f ./.env ./packages/api/prisma/.env
lerna bootstrap
lerna run amplify:push
lerna run dev
