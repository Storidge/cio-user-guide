---
title: Volumes for docker compose and docker stacks
description: Automatically create docker volumes from docker compose and docker stack files
lang: en-US
---

# Volumes with Docker Compose

Volumes are useful for distributed applications launched as a docker compose or stack file.

The following example demonstrates how to create a docker compose (stack) file to launch a wordpress service with a mysql database dependency.

First create the docker compose file `wordpress-mysql.yml`:
```
version: '3'
services:
  db:
    image: mysql:5.7
    volumes:
        # Pass volume mysql-data to mysql
      - "mysql-data:/var/lib/mysql"
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: wordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    links:
      - db
    ports:
      - "8080:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_PASSWORD: wordpress

# Add definition to create volume mysql-data referenced above
volumes:
  mysql-data:
    driver: cio
    driver_opts:
      profile: "MYSQL"
```
In the above file a volume is attached to the db service and defined at the bottom of the file to be created through the cio volume driver using the MYSQL profile.

A Docker Stack can now be launched from this file:
```
$ docker stack deploy --compose-file wordpress-mysql.yml wp

Creating network wp_default
Creating service wp_db
Creating service wp_wordpress
```

The two services should now be listed and once they are both running wordpress can be reached at port 8080.
```
$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                          PORTS
8iqdjhw8r2ha        wp_db               replicated          1/1                 mysql:5.7                      
hdx342fmn9tn        wp_wordpress        replicated          1/1                 wordpress:latest               *:8080->80/tcp
```
