# High availability

High availability refers to the amount of time during which a service is both responsive and available to the user. A highly available system is continuously running most of the time and is quickly restored if it goes down. This requires having fault-detecting mechanisms in place that trigger recovery as well as backups.

<h3>High availability using CIO with Docker</h3>

The Docker Swarm is a great tool for achieving high availability- if a node fails the scheduler simply moves and restarts the service on another node in the swarm. Its only drawback is that data cannot be so easily carried over. Storidge's CIO patches this hole by swiftly and fluidly moving volumes around a cluster. Combined, Docker Swarm and CIO provide a simple way to build and manage high availability systems which can be rebuilt quickly and automatically with all data intact.

Using the previous [Docker Stack example](docker_stack_volumes.html) we can see the services and volumes on a 4 node cluster:

```
root@a1:~$ cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
a1                   172.31.20.244     049a522f   sds        normal     
a2                   172.31.23.155     542d6d8e   backup1    normal     
a3                   172.31.26.219     635c0ab8   backup2    normal     
a4                   172.31.28.40      768de531   standard   normal   

root@a1:~$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                          PORTS
zdn77d7ge2dc        portainer           replicated          1/1                 portainerci/portainer:pr2711   *:9000->9000/tcp
twr4qr1ccw8f        wp_db               replicated          1/1                 mysql:5.7                      
gvwsp5y4hvq5        wp_wordpress        replicated          1/1                 wordpress:latest               *:8080->80/tcp

root@a1:~$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
a3                   vd1       SSD   2-copy                  20GB  bab2f427  portainer         
a2                   vd8       SSD   3-copy                  10GB  8f4fcc9a  wp_mysql-data
```

There are three services and two volumes on this cluster. The portainer service uses the portainer volume, and the wp_db service uses the wp_mysql-data volume. The services associated with the two volumes will be running in containers on the same nodes (portainer on a3 and wp_db on a2). These are the lists of containers on each node in the cluster:

```
root@a1:~$ docker container ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

root@a2:~$ docker container ps
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                 NAMES
700c4671f391        mysql:5.7           "docker-entrypoint.s…"   About a minute ago   Up About a minute   3306/tcp, 33060/tcp   wp_db.1.x3hmtx5pabex3rh49p8s8z7tt

root@a3:~$ docker container ps
CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS               NAMES
69368c0d5a85        portainerci/portainer:pr2711   "/portainer -H unix:…"   29 minutes ago      Up 29 minutes       9000/tcp            portainer.1.klj8kth1i0ckzzf9z4ehqhzne

root@a4:~$ docker container ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
18cb3307341f        wordpress:latest    "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes        80/tcp              wp_wordpress.1.ckmnj5frmf05jjaev9iugh7ba
```

If node a2 were to go down docker would rebuild the wp_db service on a different node and CIO would move the wp_mysql-data volume over as well. Initially when the node goes down there would be no running wp_db service on the cluster:
```
root@a1:~$ cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
a1                   172.31.20.244     049a522f   sds        normal     
a2                   172.31.23.155     542d6d8e   backup1    maintenance
a3                   172.31.26.219     635c0ab8   backup2    normal     
a4                   172.31.28.40      768de531   standard   normal

root@a1:~$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                          PORTS
zdn77d7ge2dc        portainer           replicated          1/1                 portainerci/portainer:pr2711   *:9000->9000/tcp
twr4qr1ccw8f        wp_db               replicated          0/1                 mysql:5.7                      
gvwsp5y4hvq5        wp_wordpress        replicated          1/1                 wordpress:latest               *:8080->80/tcp
```

Soon after node a2 goes down the wp_db service is scheduled to start running on a healthy node, in this case a1:
```
root@@a1:~$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                          PORTS
zdn77d7ge2dc        portainer           replicated          1/1                 portainerci/portainer:pr2711   *:9000->9000/tcp
twr4qr1ccw8f        wp_db               replicated          1/1                 mysql:5.7                      
gvwsp5y4hvq5        wp_wordpress        replicated          1/1                 wordpress:latest               *:8080->80/tcp

root@a1:~$ sudo docker container ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                 NAMES
9f41eeeb9ec9        mysql:5.7           "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes        3306/tcp, 33060/tcp   wp_db.1.4jxusm7mh6rpyniw24w748hrl

root@a3:~$ sudo docker container ps
CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS               NAMES
69368c0d5a85        portainerci/portainer:pr2711   "/portainer -H unix:…"   About an hour ago   Up About an hour    9000/tcp            portainer.1.klj8kth1i0ckzzf9z4ehqhzne

root$ sudo docker container ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
18cb3307341f        wordpress:latest    "docker-entrypoint.s…"   26 minutes ago      Up 26 minutes       80/tcp              wp_wordpress.1.ckmnj5frmf05jjaev9iugh7ba
```

CIO then moves the wp_mysql-data volume to accompany the wp_db service on node a1:
```
root@a1:~$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
a3                   vd1       SSD   2-copy                  20GB  bab2f427  portainer         
a1                   vd8       SSD   3-copy                  10GB  8f4fcc9a  wp_mysql-data  
```

The revival of the wp_db service took under a minute and required no manual resolution. This lightweight solution automates rebuilding failed services and retaining their data, providing an elegant approach to high availability systems.
