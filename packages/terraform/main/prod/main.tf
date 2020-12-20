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
        github = {
            source = "hashicorp/github"
            version = "4.1.0"
        }
    }
    backend "s3" {
        bucket = "launchpad-tf-backend"
        key    = "tf/prod"
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

provider "github" {
    token = var.github_personal_access_token
}

module "auth" {
    source = "../../auth"
    facebook_client_id = var.facebook_client_id
    facebook_client_secret = var.facebook_client_secret
    google_client_id = var.google_client_id
    google_client_secret = var.google_client_secret
    user_pool_domain = var.user_pool_domain
    client_name = var.client_name
    sign_in_callback_url = var.sign_in_callback_url
    sign_out_callback_url = var.sign_out_callback_url
    user_pool_name = var.user_pool_name
    lambda_custom_message_name = "prod_custom_message_lambda"
    lambda_role_name = "prod_iam_for_lambda_production"
}

module "database" {
    source = "../../database"
    db_cluster_name = var.db_cluster_name
    db_cluster_size = var.db_cluster_size
    db_node_count = 1
    region = "ams2"
    secret_name_encrypted = "PROD_TF_VAR_DATABASE_URL" #tfsec:ignore:GEN003
    secret_name_unencrypted = "PROD_TF_VAR_DATABASE_URL_DO_ENCRYPTED" #tfsec:ignore:GEN003
    secrets_repository = element(split("/", var.api_git_repo), 1)
}

module "apps" {
    source = "../../apps"
    auth_cookie_domain = var.auth_cookie_domain
    auth_cookie_expiry_days = var.auth_cookie_expiry_days
    auth_cookie_path = var.auth_cookie_path
    auth_cookie_secure = var.auth_cookie_secure
    aws_access_key = var.aws_access_key
    aws_region = var.aws_region
    cloudinary_cloud_name = var.cloudinary_cloud_name
    cloudinary_key = var.cloudinary_key
    do_token = var.do_token
    media_temp_folder = "/tmp"
    sign_in_callback_url = var.sign_in_callback_url
    sign_out_callback_url = var.sign_out_callback_url
    user_pool_domain = var.user_pool_domain
    api_git_branch = var.api_git_branch
    api_git_repo = var.api_git_repo
    api_source_dir = var.api_source_dir
    web_git_branch = var.web_git_branch
    web_git_repo = var.web_git_repo
    web_source_dir = var.web_source_dir
    api_instance_size = var.api_instance_size
    web_instance_size = var.web_instance_size
    api_port = var.api_port
    web_port = var.web_port
    web_domain_name = var.web_domain_name
    api_domain_name = var.api_domain_name
    api_application_name = var.api_application_name
    web_application_name = var.web_application_name
    # Outputs from creating the authentication
    aws_user_pool_client_id = module.auth.user_pool_client_id
    aws_user_pool_id = module.auth.user_pool_id
    # secrets
    database_url_do_encrypted = (var.database_url_do_encrypted != null && var.database_url_do_encrypted != "") ? var.database_url_do_encrypted : module.database.db_connection_string
    aws_secret_access_key_do_encrypted = var.aws_secret_access_key_do_encrypted
    cloudinary_secret_key_do_encrypted = var.cloudinary_secret_key_do_encrypted
}
