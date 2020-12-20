variable "db_cluster_name" {
    type = string
}

variable "db_cluster_size" {
    type = string
}

variable "db_node_count" {
    type = number
}

variable "secrets_repository" {
    type = string
}

variable "secret_name_unencrypted" {
    type = string
}

variable "secret_name_encrypted" {
    type = string
}

variable "region" {
    type = string
}

