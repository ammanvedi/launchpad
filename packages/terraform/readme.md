# Terraform
The backend infrastructure

```graphql
.
├── apps            # Config for web and api applications
├── auth            # Config for AWS Amplify
├── database        # Config for database
├── main
│ ├── dev           # Main configuration for development setup
│ └── prod          # Main configuration for production
└── scripts         # Helper scripts, mostly used in CI
```

## NPM Scripts

`npm run terraform:dev:init` - Runs [terraform init](https://www.terraform.io/docs/commands/init.html) for the development setup

`npm run terraform:dev:plan` - Runs [terraform plan](https://www.terraform.io/docs/commands/plan.html) for the development setup

`npm run terraform:dev:apply` - Runs [terraform apply](https://www.terraform.io/docs/commands/apply.html) for the development setup

`npm run terraform:dev:refresh` - Runs [terraform refresh](https://www.terraform.io/docs/commands/refresh.html) for the development setup

`npm run terraform:dev:destroy` - Runs [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) for the development setup

`npm run terraform:dev:output` - Runs [terraform output](https://www.terraform.io/docs/commands/output.html) for the development setup

operations on the production terraform setup are done by Github Actions, for more information read the root readme.md file

## Terraform
Terraform is an infrastructure as code tool it is used to set up resources in cloud providers and make sure the state of those resources is what we expect it to be.

There are two configurations for terraform here dev and prod. You can add extra environments as you please by using either of these as a template for how to structure things

To learn more about terraform please see the official documentation https://www.terraform.io/
