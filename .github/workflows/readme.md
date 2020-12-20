# Github Setup

You will need to set up all of the environment variables in the .env.example as github secrets
But each will need to be prefixed with an environment slug based on which environment they apply to

for example

TF_VAR_database_url --> PROD_TF_VAR_DATABASE_URL

NOTE BAD EXAMPLE AS YOU SHOULD NTO CREATE DTABASE URL IN PRODUCTION IT WILL BE CREATED BY TERRAFORM ON
THE FIRST RUN

pleasse note that github will convert the envars to upper case so they need to be referecned
like that in the workflow, we use the lowercase alternative to be abel to adhere to the style of
terraform variables where most of these things end up

adding an envar
add to your .env
add it to .env.example
update vars lists in .github/workflows/*.yml
if it is a secret then you will need to keep it in the envar and also in another envar
%ENV%_%ENVARNAME%_DO_ENCRYPTED because digitalocean will

