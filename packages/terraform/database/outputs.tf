output "db_connection_string" {
    value = digitalocean_database_cluster.main_db.uri
}
