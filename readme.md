# Launchpad

Launchpad is a (very) opinionated startup in a box. Here are the things that it provides and some key features of each;

### Web Application

React, Server Side Rendering, Styled Components, Apollo Client, React Recoil, React Router, Loadable Components (Code Splitting)

### Infrastructure

Managed with Terraform, deployed on Digital Ocean and AWS

### Authentication

AWS Cognito (username and password as well as Facebook and Google login), cookie based tokens, custom email templates

### API

GraphQl, Prisma 2, Dataloader

### Database

Postgres

### Media

Upload via GraphQL API, storage via Cloudinary



# Setup

## Prerequisites

1. [Amazon Web Services](https://aws.amazon.com/) account with the CLI set up

    1. Make sure you have the credentials file set up in `~/.aws/credentials`
    2. Make sure that you know the name of your aws profile
    3. Make sure that you know your `aws_access_key` and `aws_secret_access_key`\

2. [Digital Ocean](https://www.digitalocean.com/) account

    1. Make sure you have your Github account linked to your digital ocean account, you can do this by going to https://cloud.digitalocean.com/apps and clicking the blue button to begin the app creation process. You dont actually have tyo create an app, just get as far as linking your github account
    2. Generate a personal access token from  https://cloud.digitalocean.com/account/api/tokens make sure it has both read and write permissions, This will be reffered to as `do_token` or similar in the following sections.

3. [Cloudinary](https://cloudinary.com/) account

    1. Make sure you know your `cloudinary_cloud_name`
    2. Make sure you know your `cloudinary_key`
    3. Make sure you know your `cloudinary_secret_name`

4. [Github](https://github.com/) account

    1. Youll need to generate a personal access token from https://github.com/settings/tokens which will be referred to as `github_personal_access_token` in the following sections. Please make sure this token has __repo__ and __read:public_key__ permissions for the repository where this application is stored.

5. A custom domain for your applications to be deployed under

6. Identity Provider client id's and client secrets for Facebook and Google for clearer instructions on this please see the "Identity Providers" section

7. [Terraform CLI](https://learn.hashicorp.com/tutorials/terraform/install-cli) set up, this code was tested with `v0.14.2`

8. [NodeJS and NPM](https://nodejs.org/en/download/), this code was tested with Node `v10.15.3` and NPM `v6.4.1`

9. An S3 bucket for storing Terraform configurations in a central location

    1. Create a new S3 bucket in the AWS console

    2. Once it is available you will need to update the parameters in

       `packages/terraform/main/dev/main.tf`

       `packages/terraform/main/prod/main.tf`

       specifically the "backend" section

       ```
           backend "s3" {
               bucket = "launchpad-tf-backend" # CHANGE THIS
               key    = "tf/prod"
               region = "eu-west-1" # CHANGE THIS
               profile = "launchpad" # CHANGE THIS
               shared_credentials_file = "~/.aws/credentials"
           }
       ```

       Unfortunately this section cannot be configured manually, hence the need to change this by hand directly instead of through configuration files or envars

10. Duplicate the `.example.env` in the repo root into a `.env` file and in the root run

    `npm run symlink-env` to make the `.env` available in all the other package subdirectories that need it

9. As described in the `.example.env` youll need to create the described repository secrets based on the values that are described above.

    1. Dont worry about `TF_VAR_aws_user_pool_id` and `TF_VAR_aws_user_pool_client_id` we can get those from the output of the terraform run a bit later when we create our development infrastructure

10. Run an `npm install` in each subdirectory of `packages/`

11. [Postgresql](https://www.postgresql.org/) server running locally

    1. The backend store for the application is postgres, so for development you will need a local server running. Once running you will need to set the `TF_VAR_database_url` in your `.env` to your local postgres connection URI



### Identity Providers

AWS Cognito is used as the identity provider for user authentication. It acts as a broker for dealing with external identiy providers such as Google and Facebook. However there is a small piece of configuration to be done here.

In general authenticating with external providers works as follows;

1. The web application asks cognito to authenticate a user with an external provider by accessing a specific url with specific parameters. For example

   `https://<user_pool_domain>.auth.<aws_region>.amazoncognito.com/auth/google`

   The authentication server then redirects us to Google where the user authenticate.

2. Now google will redirect back to the authentication server which will perform some further actions, such as storing user data and issuing cognito specific tokens
3. After that we are directed back to our application.

The setup we need to do is

1. Tell the identity providers, in step 2, what url they should be redirecting to

2. Provide the auth server (cognito) with tokens issued from the identity provider in order to prove our identity to those services



#### Facebook

Please see the instructions in the [AWS docs about how to set up external identity providers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html) and save the client id and client secret, they will be reffered to as `facebook_client_id` and `facebook_client_secret` in the coming sections

Your app domain will be

`https://<user_pool_domain>.auth.<aws_region>.amazoncognito.com`

Your authorised redirect URI should be

`https://<user_pool_domain>.auth.<aws_region>.amazoncognito.com/oauth2/idresponse`

You will be able to find your user pool domain in

1. `TF_VAR_user_pool_domain` in `.env` for development
2. `user_pool_domain`in `packages/terraform/main/prod/prod.auto.tfvars`

In both cases you need to change this from the default value to something that is unique enough to not clash with anyone elses auth domains

Your aws region is

1. `TF_VAR_aws_region` in `.env` for development

2. In the Github secret `PROD_TF_VAR_AWS_REGION` for production



#### Google

Instructions are the same as Facebook above but the credentials will be described as `google_client_id` and `google_client_secret` in the coming sections



## Deploying Development Infrastructure

We will use Terraform to set up the neccacary componsnet for development. Since we will be running our database and our applications on our local machine, all that we really need to deploy is the AWS Cognito authentication resources.

You can see the entry point of the deployment in

`packages/terraform/main/dev/main.tf`

and you can see some coniguration values that are passed in in the file

`packages/terraform/main/dev/dev.auto.tfvars`

Configuration is also passed in via the `.env` file, which is why you will see alot of envars prefixed with `TF_VAR_` as this allows terraform to pull them [out of the environment automatically](https://www.terraform.io/docs/commands/environment-variables.html)

1. `cd packages/terraform`

2. `npm run terraform:dev:plan`

   The output of this will show you what terraform plans to create and where, have a read through the output and make sure that everything looks OK, if you are happy then move onto the next command

3. `npm run terraform:dev:apply`

   This step will actually create the infrastructure, or update it if it already exists. While it is doing this it will also create and update the backend state file that is stored in the S3 bucket that we set up earlier. If you are curious you can go and inspect it after this step is complete.

   Also once this step is complete you can log into the AWS console and inspect the actual infrastruture that was created, But remember than t if you want to make any changes that those changes should only ever be made through Terraform, otherwise the state that terraform has stored and the state of the real world can start to drift apart, which kind of defeats the point.

4. Should everything go well at this stage terraform will helpfully output the values that we are missing from our environment variables

   `user_pool_id`

   `user_pool_client_id`

   So lets take these and lets assign them to the associated envars in our `.env`

   `TF_VAR_aws_user_pool_id`

   `TF_VAR_aws_user_pool_client_id`



## Running Development Applications

Now that we have our development infra set up we can start up the front end application and the back end API.

### Web Application

`cd packages/web`

`npm run dev`

the application should be running on http://localhost:8500 now

### API

`cd packages/api`

`npm run dev`

the application should be running on http://localhost:4000 now

Now that the apps are running you can have a play around and make sure everything looks OK. For more details about each app individually you can take a look in the readme files in their respective directories.



## Deploying Production Infrastructure & Applications

Please make sure you have set up the `PROD_` secret values in github as described in the `.env.example` you can find where to set them at

`https://github.com/<USER>/<REPO>/settings/secrets/actions`

As these values along with the values in

`packages/terraform/main/prod/prod.auto.tfvars`

will combine to form the configuration that will be used to deploy to production. in the `prod.auto.ftvars` you need to make sure that you have updated the following values to reflect your setup

```
web_git_repo 				# your repo in format user/repo
web_domain_name 		# custom domain name to assign to the web app
api_git_repo				# your repo in format user/repo
api_domain_name 		# custom domain name to assign to the api app
auth_cookie_domain 	# what domain to assign to auth cookies
user_pool_domain 		# the domain of your cognito auth server, need to be globally unique
```

All production actions are handled by Github Actions CI tasks so as not to be tied to your local machine (as some can take a while to complete)

Here is an overview of all of the github actions that are available as part of this repository

### Actions

The directory `.github/workflows/` contains the definitions for the various github actions that manage the deployment to production.



`Prod :: App :: API Deployment`

__Runs When:__ Any changes to the API application are merged into the master branch

__Description:__ Will trigger a new deployment to be created in Digital Ocean



`Prod :: App :: Web Deployment`

__Runs When:__ Any changes to the web application are merged into the master branch

__Description:__ Will trigger a new deployment to be created in Digital Ocean



`Database :: Prod :: Apply Migrations`

__Runs When:__ Any changes to the files in `api/prisma` application are merged into the master branch

__Description:__ Will trigger all migrations to be applied to the production database cluster



`Prod :: Terraform :: Apply`

__Runs When:__ Any changes to the terraform files are made, or any changes made in the lambda directory are merged into the master branch

__Description:__ Will trigger the application of the terraform state in code to be applied to the real world environment



`Prod :: Terraform :: Destroy`

__Runs When:__ Only when triggered manually

__Description:__ Will trigger the production resources that have been created to be destroyed



`Prod :: Terraform :: Plan`

__Runs When:__ A pull request is made to master with changes to terraform files or changes to lambda function code.

__Description:__ Will plan any changes and make a comment on the PR when complete



### Initial Deployment

In order to set up the infrastructure initially you can trigger the `Prod :: Terraform :: Plan` action manually first

__The commenting stage of the action will fail, but dont worry about this, the action is designed to run in a PR context so when it tries to make a comment on the pr but its being triggered manually it fails, it wont affect the function of the action__

As before, once you are happy you can then trigger `Prod :: Terraform :: Apply` manually also. The following creation will take some time, just check in on it every so often.

Once it is complete you will see some outputs from the terraform apply stage in the Github Actions output, we need to take a note of

`web_url`  The Digital Ocean url of the web application

`api_url `  The Digital Ocean url of the api application



### DNS Updates

We had previously updated `prod.auto.ftvars` with values for `web_domain_name` and `api_domain_name` that point to our own custom domain. Wherever your domain is managed you will now need to set up a CNAME record that maps

`web_domain_name`  →  `web_url`

`api_domain_name`  →  `api_url `

If you missed these values in the terraform output you can also go to teh application in Digital Ocean and find it in the application settings.



### Future Deployments

As described in the actions section the actions are triggered mainly when changes are made to code in certain directories that relate to each action. So these actions this should take care of future deployments. However you can also trigger each manually whenever you like, or change the conditions of the actions as you like.



