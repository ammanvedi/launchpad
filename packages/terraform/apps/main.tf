# Global Providers

terraform {
    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
            version = "2.3.0"
        }
    }
}

resource "digitalocean_app" "api" {
    spec {
        name = var.api_application_name
        region = var.api_region
        domains = [var.api_domain_name]

        service {
            name = var.api_application_name
            environment_slug = "node-js"
            instance_count = 1
            instance_size_slug = var.api_instance_size

            source_dir = var.api_source_dir
            http_port = var.api_port

            build_command = "npm run build"
            run_command = "npm run start"

            github {
                branch         = var.api_git_branch
                deploy_on_push = false
                repo           = var.api_git_repo
            }

            routes {
                path = "/"
            }

            env {
                key = "TF_VAR_aws_secret_access_key"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_secret_access_key_do_encrypted
                type = "SECRET"
            }

            env {
                key = "TF_VAR_cloudinary_secret_key"
                scope = "RUN_AND_BUILD_TIME"
                value = var.cloudinary_secret_key_do_encrypted
                type = "SECRET"
            }

            env {
                key = "TF_VAR_database_url"
                scope = "RUN_AND_BUILD_TIME"
                value = var.database_url_do_encrypted
                type = "SECRET"
            }

            env {
                key = "TF_VAR_cloudinary_key"
                scope = "RUN_AND_BUILD_TIME"
                value = var.cloudinary_key
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_access_key"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_access_key
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_cloudinary_cloud_name"
                scope = "RUN_AND_BUILD_TIME"
                value = var.cloudinary_cloud_name
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_region"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_region
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_user_pool_id"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_user_pool_id
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_user_pool_client_id"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_user_pool_client_id
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_user_pool_domain"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_domain
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_sign_in_callback_url"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_sign_in_callback_url
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_sign_out_callback_url"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_sign_out_callback_url
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_api_media_temp_folder"
                scope = "RUN_AND_BUILD_TIME"
                value = var.api_media_temp_folder
                type = "GENERAL"
            }
        }
    }
}

resource "digitalocean_app" "web" {
    spec {
        name = var.web_application_name
        region = var.web_region
        domains = [var.web_domain_name]

        service {
            name = var.web_application_name
            environment_slug = "node-js"
            instance_count = 1
            instance_size_slug = var.web_instance_size

            source_dir = var.web_source_dir
            http_port = var.web_port

            build_command = "npm run build:with-serialised-env"
            run_command = "npm run start"

            github {
                branch         = var.web_git_branch
                deploy_on_push = false
                repo           = var.web_git_repo
            }

            routes {
                path = "/"
            }

            env {
                key = "TF_VAR_aws_region"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_region
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_public_graphql_endpoint"
                scope = "RUN_AND_BUILD_TIME"
                value = digitalocean_app.api.live_url
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_user_pool_id"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_user_pool_id
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_aws_user_pool_client_id"
                scope = "RUN_AND_BUILD_TIME"
                value = var.aws_user_pool_client_id
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_user_pool_domain"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_domain
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_user_pool_sign_in_callback_url"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_sign_in_callback_url
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_user_pool_sign_out_callback_url"
                scope = "RUN_AND_BUILD_TIME"
                value = var.user_pool_sign_out_callback_url
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_auth_cookie_path"
                scope = "RUN_AND_BUILD_TIME"
                value = var.auth_cookie_path
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_auth_cookie_domain"
                scope = "RUN_AND_BUILD_TIME"
                value = var.auth_cookie_domain
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_auth_cookie_expiry_days"
                scope = "RUN_AND_BUILD_TIME"
                value = var.auth_cookie_expiry_days
                type = "GENERAL"
            }

            env {
                key = "TF_VAR_auth_cookie_secure"
                scope = "RUN_AND_BUILD_TIME"
                value = var.auth_cookie_secure
                type = "GENERAL"
            }
        }
    }
}



