output "application_url" {
  description = "URL de l'application"
  value       = "http://localhost"
}

output "api_url" {
  description = "URL de l'API"
  value       = "http://localhost/api"
}

output "backend_direct_url" {
  description = "URL directe du backend (sans reverse proxy)"
  value       = "http://localhost:5000"
}

output "frontend_direct_url" {
  description = "URL directe du frontend (sans reverse proxy)"
  value       = "http://localhost:3000"
}

output "database_port" {
  description = "Port PostgreSQL"
  value       = "5432"
}

output "container_ids" {
  description = "IDs des conteneurs"
  value = {
    nginx    = docker_container.nginx.id
    frontend = docker_container.frontend.id
    backend  = docker_container.backend.id
    database = docker_container.db.id
  }
}
