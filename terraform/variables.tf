variable "db_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "stagiaire_db"
}

variable "db_username" {
  description = "Nom d'utilisateur de la base de données"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Mot de passe de la base de données"
  type        = string
  default     = "admin123"
  sensitive   = true
}
