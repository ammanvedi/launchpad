you will need to first install and configure the aws amplify cli 

https://docs.amplify.aws/cli/start/install
setup .env
ln -f ./.env ./packages/web/.env
ln -f ./.env ./packages/api/.env
lerna bootstrap
lerna run amplify:push
lerna run dev

lerna bootstrap --force-local && lerna link --force-local && lerna run prisma:generate && lerna run build --scope app