variable "aws_region" {
    type = string
}

# User pool id and user pool client id are taken as outputs of the user module

variable "aws_user_pool_id" {
    type = string
}

variable "aws_user_pool_client_id" {
    type = string
}

variable "user_pool_domain" {
    type = string
}

variable "user_pool_sign_in_callback_url" {
    type    = string
}

variable "user_pool_sign_out_callback_url" {
    type    = string
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

variable "aws_access_key" {
    type = string
}

variable "cloudinary_key" {
    type = string
}

variable "cloudinary_cloud_name" {
    type = string
}

variable "api_media_temp_folder" {
    type = string
}

variable "do_token" {
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

variable "database_url_do_encrypted" {
    type = string
}

variable "aws_secret_access_key_do_encrypted" {
    type = string
}

variable "cloudinary_secret_key_do_encrypted" {
    type = string
}

variable "web_domain_name" {
    type = string
}

variable "api_domain_name" {
    type = string
}

variable "api_region" {
    type = string
}

variable "web_region" {
    type = string
}

