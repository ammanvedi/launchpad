# Github Setup

You will need to set up all of the environment variables in the .env.example as github secrets
But each will need to be prefixed with an environment slug based on which environment they apply to

for example

TF_VAR_database_url --> PROD_TF_VAR_DATABASE_URL

pleasse note that github will convert the envars to upper case so they need to be referecned
like that in the workflow, we use the lowercase alternative to be abel to adhere to the style of
terraform variables where most of these things end up

adding an envar
add to your .env
add it to .env.example
if it is a secret make sure it is added to ::add_mask:: in any workflows in .github/workflows
update vars lists in .github/workflows/*.yml

