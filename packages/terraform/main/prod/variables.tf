variable "database_url" {
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

variable "user_pool_client_name" {
    type    = string
    default = "up_launchpad_dev_client"
}

variable "user_pool_sign_in_callback_url" {
    type    = string
}

variable "user_pool_sign_out_callback_url" {
    type    = string
}

variable "user_pool_lambda_name_custom_message" {
    type = string
}


variable "user_pool_lambda_role_name" {
    type = string
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

variable "api_media_temp_folder" {
    type = string
    default = "/tmp"
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

variable "aws_secret_access_key_do_encrypted" {
    type = string
    default = null
}

variable "cloudinary_secret_key_do_encrypted" {
    type = string
    default = null
}

variable "database_url_do_encrypted" {
    type = string
    default = null
}

variable "web_domain_name" {
    type = string
}

variable "api_domain_name" {
    type = string
}

variable "db_cluster_name" {
    type = string
}

variable "db_cluster_size" {
    type = string
}

variable "db_region" {
    type = string
}

variable "db_uri_github_secret_name_unencrypted" {
    type = string
}

variable "db_uri_github_secret_name_encrypted" {
    type = string
}

variable "github_personal_access_token" {
    type = string
}

variable "api_region" {
    type = string
}

variable "web_region" {
    type = string
}


variable "web_node_count" {
    type = number
}

variable "api_node_count" {
    type = number
}

variable "db_node_count" {
    type = number
}
