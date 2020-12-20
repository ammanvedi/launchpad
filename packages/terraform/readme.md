setup a s3 bucket to store your s3 configs

https://www.terraform.io/docs/backends/types/s3.html

make sure you have the correct permissions

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mybucket"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::mybucket/path/to/my/key"
    }
  ]
}
```


this setup does not LOCK STSTAE

https://www.terraform.io/docs/state/locking.html

you should also update the backend configs in each environment as terraform does nto allow you to
set these up with envars so youll have to do it manually

the purpose of a secret is to be secret, however this causes a problem for terraform
https://github.com/digitalocean/terraform-provider-digitalocean/issues/514
https://github.com/hashicorp/terraform/issues/26359

1. ignore changes there
2. store the value unencrypted
3. deal with the recreation
4. self encrypt the value

make sure you set up the s3 bucket to store terraform congiof

1. add in the appropriate variables file for each environments
   packages/terraform/main/prod/variables.tf
2. use the envars as you please in terraform
3. in order to feed the var to terraform through the env it needs to be prefixed
    with TF_VAR_%variable name% so create an envar named like this and add it to .example.env
4. now you will need to make sure that it gets fed through to terraform in CI so in the .github/workflows
directory make sure that you have added it to the env: mappings. github will pull it in based on the environment of the
action, e.g. PROD_TF_VAR_%yourvaribale%
5. now you need to create the PROD_TF_VAR... in the github repository secrets for the repo where launchpad is stored


domains
https://www.digitalocean.com/docs/app-platform/how-to/manage-domains/

you will provide two envars that describe which domains you want the applications to be hosted under
you will either need to

1. add digitalocean name servers to your root domain settings, wherever they might be
2. add a cname record that points from the desired domain to the domain where the app is hosted
you can find the apps url by either looking at the terraform output or going to the DO console
https://cloud.digitalocean.com/apps/%APPID%

