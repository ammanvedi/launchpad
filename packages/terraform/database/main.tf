terraform {
    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
            version = "2.3.0"
        }
        github = {
            source = "hashicorp/github"
            version = "4.1.0"
        }
    }
}

resource "digitalocean_database_cluster" "main_db" {
    name       = var.db_cluster_name
    engine     = "pg"
    version    = "11"
    size       = var.db_cluster_size
    region     = var.region
    node_count = var.db_node_count
}

data "github_actions_public_key" "repo_public_key" {
    repository = var.secrets_repository
}

resource "github_actions_secret" "db_url_raw_secret" {
    plaintext_value = digitalocean_database_cluster.main_db.uri
    repository = var.secrets_repository
    secret_name = var.secret_name_unencrypted
}

resource "github_actions_secret" "db_url_do_encrypted_secret" {
    plaintext_value = digitalocean_database_cluster.main_db.uri
    repository = var.secrets_repository
    secret_name = var.secret_name_encrypted
}
