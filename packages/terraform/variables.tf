variable "database_url" {
    type = string
}

variable "public_graphql_endpoint" {
    type = string
}

variable "aws_access_key" {
    type = string
}

variable "aws_secret_access_key" {
    type = string
}

variable "aws_profile" {
    type = string
}

variable "aws_region" {
    type = string
}

variable "user_pool_name" {
    type    = string
    default = "up_launchpad_dev"
}

variable "facebook_client_id" {
    type = string
}

variable "facebook_client_secret" {
    type = string
}

variable "google_client_id" {
    type = string
}

variable "google_client_secret" {
    type = string
}

variable "client_name" {
    type    = string
    default = "up_launchpad_dev_client"
}

variable "sign_in_callback_url" {
    type    = string
}

variable "sign_out_callback_url" {
    type    = string
}

variable "user_pool_domain" {
    type = string
}

variable "do_token" {
    type = string
}

variable "cloudinary_key" {
    type = string
}

variable "cloudinary_secret_key" {
    type = string
}

variable "cloudinary_cloud_name" {
    type = string
}

variable "auth_cookie_path" {
    type = string
}

variable "auth_cookie_domain" {
    type = string
}

variable "auth_cookie_expiry_days" {
    type = string
}

variable "auth_cookie_secure" {
    type = string
}

variable "web_git_repo" {
    type = string
}

variable "web_git_branch" {
    type = string
}

variable "web_source_dir" {
    type = string
}

variable "api_git_repo" {
    type = string
}

variable "api_git_branch" {
    type = string
}

variable "api_source_dir" {
    type = string
}


variable "api_instance_size" {
    type = string
}


variable "web_instance_size" {
    type = string
}

variable "web_port" {
    type = number
}

variable "api_port" {
    type = number
}

variable "api_application_name" {
    type = string
}

variable "web_application_name" {
    type = string
}
