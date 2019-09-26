---
title: Create docker volume with docker run or docker service
description: Easily create docker volume with docker run or docker service and Storidge volume plugin
lang: en-US
---

# Volumes with Docker CLI

Volumes can also be used with Docker containers, services, and [stacks](docker_stack_volumes.html) through the cio volume plugin.

<h3>Docker volumes</h3>

This example demonstrates how to create the docker volume foo using the cio driver and an option to set its capacity to 15GB:

```
$ docker volume create --driver cio --name foo --opt capacity=15
```

This volume can be seen in both the cio and docker volume lists:

```
$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
u3                   vd1       SSD   2-copy                  25GB  adc4800a  portainer         
u1                   vd2       SSD   2-copy                  15GB  fd35e844  foo               

$ docker volume ls
DRIVER              VOLUME NAME
cio:latest          foo
cio:latest          portainer
```

An easier way to configure volume options is through the use of profiles. This is explained in greater detail in the next two sections: [Why profiles](why_profiles.html) and [Using profiles](using_profiles.html).

<h3>Docker containers</h3>

Volumes can be attached to docker containers either through the -v or --mount flags. The next two examples demonstrate how to launch a docker container running alpine and connect the volume foo to it.

A container can be launched using the -v flag:
```
$ docker run -it --volume-driver cio -v foo:/tmp --name foo alpine sh
/ #
```
or the --mount flag:
```
$ docker run -it --mount source=foo,target=/tmp,volume-driver=cio --name foo alpine sh
/ #
```

If the docker volume foo already exists then it will be attached to the containers, otherwise a new volume foo will be generated.

<h3>Docker services</h3>

Volumes can similarly be used with docker services and created using the --mount flag. In this example a mysql service is launched using the cio volume driver and the MYSQL profile:
```
$ docker service create --replicas 1 --detach=false -e MYSQL_ROOT_PASSWORD=mysecret --mount source=mysql-data,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=MYSQL --name mysql mysql
wcwgas7wh9fw6k2smnzy5jcwl
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged
```
