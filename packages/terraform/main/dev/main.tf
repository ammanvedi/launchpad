terraform {
    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
            version = "2.3.0"
        }
        aws = {
            source  = "hashicorp/aws"
            version = "3.18.0"
        }
    }
    backend "s3" {
        bucket = "launchpad-tf-backend"
        key    = "tf/dev"
        region = "eu-west-1"
        profile = "launchpad"
        shared_credentials_file = "~/.aws/credentials"
    }
}
# DIGITAL OCEAN

provider "digitalocean" {
    token = var.do_token
}

# AWS
provider "aws" {
    profile = var.aws_profile
    region  = var.aws_region
}

module "auth" {
    source = "../../auth"
    facebook_client_id = var.facebook_client_id
    facebook_client_secret = var.facebook_client_secret
    google_client_id = var.google_client_id
    google_client_secret = var.google_client_secret
    user_pool_domain = var.user_pool_domain
    client_name = var.user_pool_client_name
    sign_in_callback_url = var.user_pool_sign_in_callback_url
    sign_out_callback_url = var.user_pool_sign_out_callback_url
    user_pool_name = var.user_pool_name
    lambda_custom_message_name = var.user_pool_lambda_name_custom_message
    lambda_role_name = var.user_pool_lambda_role_name
}

# in development the apps run locally so we dont need to deploy the
# actual apps anywhere, we just need to set up the authentication flows
