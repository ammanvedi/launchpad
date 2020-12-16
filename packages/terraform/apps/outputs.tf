output "web_url" {
    value = digitalocean_app.web.default_ingress
}

output "api_url" {
    value = digitalocean_app.api.default_ingress
}
