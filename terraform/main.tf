terraform {
  required_version = ">= 1.0"
  
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Réseau Docker
resource "docker_network" "stagiaire_network" {
  name = "stagiaire_network"
}

# Volume pour PostgreSQL
resource "docker_volume" "postgres_data" {
  name = "postgres_data"
}

# Conteneur PostgreSQL
resource "docker_image" "postgres" {
  name = "postgres:15-alpine"
}

resource "docker_container" "db" {
  name  = "stagiaire_db"
  image = docker_image.postgres.image_id

  env = [
    "POSTGRES_USER=${var.db_username}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  volumes {
    host_path      = abspath("${path.root}/../backend/init.sql")
    container_path = "/docker-entrypoint-initdb.d/init.sql"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.stagiaire_network.name
  }

  restart = "always"
}

# Build Backend Image
resource "docker_image" "backend" {
  name = "stagiaire_backend:latest"
  
  build {
    context    = abspath("${path.root}/../backend")
    dockerfile = "Dockerfile"
  }

  triggers = {
    dir_sha1 = sha1(join("", [
      filesha1("${path.root}/../backend/Dockerfile"),
      filesha1("${path.root}/../backend/server.js"),
      filesha1("${path.root}/../backend/package.json")
    ]))
  }
}

# Conteneur Backend
resource "docker_container" "backend" {
  name  = "stagiaire_backend"
  image = docker_image.backend.image_id

  env = [
    "NODE_ENV=production",
    "DB_HOST=stagiaire_db",
    "DB_PORT=5432",
    "DB_USER=${var.db_username}",
    "DB_PASSWORD=${var.db_password}",
    "DB_NAME=${var.db_name}",
    "PORT=5000"
  ]

  ports {
    internal = 5000
    external = 5000
  }

  networks_advanced {
    name = docker_network.stagiaire_network.name
  }

  depends_on = [docker_container.db]

  restart = "always"
}

# Build Frontend Image
resource "docker_image" "frontend" {
  name = "stagiaire_frontend:latest"
  
  build {
    context    = abspath("${path.root}/../frontend")
    dockerfile = "Dockerfile"
  }

  triggers = {
    dir_sha1 = sha1(join("", [
      filesha1("${path.root}/../frontend/Dockerfile"),
      filesha1("${path.root}/../frontend/package.json")
    ]))
  }
}

# Conteneur Frontend
resource "docker_container" "frontend" {
  name  = "stagiaire_frontend"
  image = docker_image.frontend.image_id

  ports {
    internal = 80
    external = 3000
  }

  networks_advanced {
    name = docker_network.stagiaire_network.name
  }

  depends_on = [docker_container.backend]

  restart = "always"
}

# Nginx Image
resource "docker_image" "nginx" {
  name = "nginx:alpine"
}

# Conteneur Nginx (Reverse Proxy)
resource "docker_container" "nginx" {
  name  = "stagiaire_nginx"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = 80
  }

  volumes {
    host_path      = abspath("${path.root}/../nginx/nginx.conf")
    container_path = "/etc/nginx/nginx.conf"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.stagiaire_network.name
  }

  depends_on = [
    docker_container.frontend,
    docker_container.backend
  ]

  restart = "always"
}
