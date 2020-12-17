output "user_pool_id" {
    value = module.auth.user_pool_id
}

output "user_pool_client_id" {
    value = module.auth.user_pool_client_id
}

output "web_url" {
    value = module.apps.web_url
}

output "api_url" {
    value = module.apps.api_url
}
