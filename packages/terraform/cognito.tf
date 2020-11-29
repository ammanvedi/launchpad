terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.18.0"
    }
  }
}

variable "aws_profile" {
  type = string
}

variable "aws_region" {
  type = string
}

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}

# User Pool

variable "user_pool_name" {
  type    = string
  default = "up_launchpad_dev"
}


resource "aws_cognito_user_pool" "master_user_pool" {
  name = var.user_pool_name

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]


  schema {
    attribute_data_type = "String"
    name                = "internalId"
    mutable             = true
    required            = false
    string_attribute_constraints {
      max_length = "256"
      min_length = "1"
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "role"
    mutable             = true
    required            = false
    string_attribute_constraints {
      max_length = "256"
      min_length = "1"
    }
  }

}

#Identity Provider :: Facebook

variable "facebook_client_id" {
  type = string
}

variable "facebook_client_secret" {
  type = string
}

resource "aws_cognito_identity_provider" "facebook" {
  provider_name = "Facebook"
  provider_type = "Facebook"
  user_pool_id  = aws_cognito_user_pool.master_user_pool.id

  provider_details = {
    authorize_scopes = "public_profile,email"
    client_id        = var.facebook_client_id
    client_secret    = var.facebook_client_secret
    attributes_url = "https://graph.facebook.com/v6.0/me?fields="
    attributes_url_add_attributes = true
    authorize_url = "https://www.facebook.com/v6.0/dialog/oauth"
    token_request_method = "GET"
    token_url = "https://graph.facebook.com/v6.0/oauth/access_token"
  }

  attribute_mapping = {
    username = "id"
    email    = "email"
  }

}

#Identity Provider :: Google

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}

resource "aws_cognito_identity_provider" "google" {
  provider_name = "Google"
  provider_type = "Google"
  user_pool_id  = aws_cognito_user_pool.master_user_pool.id

  provider_details = {
    authorize_scopes = "profile email openid"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    attributes_url = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = true
    authorize_url = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer = "https://accounts.google.com"
    token_request_method = "POST"
    token_url = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    username = "sub"
    email    = "email"
  }
}

# User Pool Client

variable "client_name" {
  type    = string
  default = "up_launchpad_dev_client"
}

variable "sign_in_callback_url" {
  type    = string
  default = "http://localhost:8500/social-sign-up/"
}

variable "sign_out_callback_url" {
  type    = string
  default = "http://localhost:8500/"
}

resource "aws_cognito_user_pool_client" "client" {
  name = var.client_name

  user_pool_id = aws_cognito_user_pool.master_user_pool.id

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]

  callback_urls                = [var.sign_in_callback_url]
  logout_urls                  = [var.sign_out_callback_url]
  supported_identity_providers = ["COGNITO", "Facebook", "Google"]

  depends_on = [aws_cognito_identity_provider.facebook, aws_cognito_identity_provider.google]
}

# User Pool Domain

variable "user_pool_domain" {
  type = string
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.user_pool_domain
  user_pool_id = aws_cognito_user_pool.master_user_pool.id
}