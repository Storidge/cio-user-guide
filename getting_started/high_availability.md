# HA for stateful apps

When you have services in production, the priority is to run these services continuously or with minimal interruptions. Delivering a consistent level of operational performance for applications is described as providing high availability (HA). Achieving this objective requires the underlying infrastructure to recover from both physical and software component failures with minimal impact to users.

An orchestration system that scales applications across multiple nodes makes it simple to deliver HA for stateless applications. On the other hand, delivering HA for stateful apps is a lot more challenging. 

The example below steps through how CIO together with Docker Swarm makes high availability for stateful apps easy.

<h3>HA with CIO and Docker Swarm</h3>

Docker Swarm is a great tool for achieving high availability. If a node fails the scheduler simply restarts the service on another node ... which is awesome for stateless apps. Stateful apps however require data on the failed node to be available before restarting. CIO will swiftly and and fluidly move the required volume to the new node where the stateful apps is restarting. Combined, Docker Swarm and CIO makes delivering HA for your stateful applications simple. 

Using the previous [Docker Stack example](docker_stack_volumes.html) we can see the services and volumes on a 4 node cluster.

```
root@v1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
v1                   192.168.3.36      f8891810   sds        normal
v2                   192.168.3.141     e08dc3c4   backup1    normal
v3                   192.168.3.160     6a41aeba   backup2    normal
v4                   192.168.3.69      75472452   standard   normal
```

There are three services and two volumes on this cluster. The portainer service is using volume portainer, and the wp_db service using volume wp_mysql-data. From the `cio volume ls` output we see the portainer service is running on node v2 and the wp_db service is running on node v3. 
```
root@v1:~# docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                        PORTS
l79f5oyxu84s        portainer           replicated          1/1                 portainer/portainer:latest   *:9000->9000/tcp
wiwp56tnc7c1        wp_db               replicated          1/1                 mysql:5.7
pck27fi2thdy        wp_wordpress        replicated          1/1                 wordpress:latest             *:8080->80/tcp

root@v1:~# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v2                   vd1       SSD   2-copy                  20GB  371f0802  portainer
v3                   vd2       SSD   3-copy                  10GB  4bd2f89f  wp_mysql-data

root@v1:~# docker service ps wp_db
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
u3joxz5yfg4h        wp_db.1             mysql:5.7           v3                  Running             Running 45 seconds ago
```

We force a failure of the database service by power cycling or rebooting node v3. `docker service ls` shows that the wp_db service is interrupted and `cio node ls` shows that node v3 is now in maintenance mode. 
```
root@v1:~# docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                        PORTS
l79f5oyxu84s        portainer           replicated          1/1                 portainer/portainer:latest   *:9000->9000/tcp
wiwp56tnc7c1        wp_db               replicated          0/1                 mysql:5.7
pck27fi2thdy        wp_wordpress        replicated          1/1                 wordpress:latest             *:8080->80/tcp

root@v1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
v1                   192.168.3.36      f8891810   sds        normal
v2                   192.168.3.141     e08dc3c4   backup1    normal
v3                   192.168.3.160     6a41aeba   backup2    maintenance
v4                   192.168.3.69      75472452   standard   normal
```

When we check the wp_db service again, we find that the CIO storage orchestrator has moved the wp_mysql_data volume to node v1. This enables the scheduler to restart the wp_db service on node v1.
```
root@v1:~# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v3                   vd1       SSD   2-copy                  20GB  371f0802  portainer
v1                   vd2       SSD   3-copy                  10GB  4bd2f89f  wp_mysql-data

root@v1:~# docker service ps wp_db
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE                ERROR               PORTS
66sobowbqmnd        wp_db.1             mysql:5.7           v1                  Running             Running about a minute ago
u3joxz5yfg4h         \_ wp_db.1         mysql:5.7           v3                  Shutdown            Shutdown 26 seconds ago
```

So in less than a minute, the wp_db service is automatically back up and running!

<h3>Data recovery</h3>
It's great that the database service is available again, but what happened to the data that was on node v3? Checking the event log with <code>cio events</code>, we find:
<ol>
  <li>There was a node failover event</li>
  <li>Rebuild processes were started to restore data redundancy</li>
  <li>The volume rebuilds were completed successfully</li>
  <li>Volume wp_mysql-data had a locality rebuild making data local to ensure consisent performance</li>
</ol>

```
root@v1:~# cio events 
05/12/2019-20:51:04 [info] [DFS] node (6a41aeba) failover completed. hostname=v4, ip address=192.168.3.69 :1019
05/12/2019-20:51:08 [info] [DFS] volume wp_mysql-data (vd2) created on node f8891810:1009
05/12/2019-20:51:08 [info] [DFS] volume wp_mysql-data (vd2) removed on node 75472452:1011
05/12/2019-20:51:59 [info] vd0 rebuilding on node f8891810:1003
05/12/2019-20:51:59 [info] volume wp_mysql-data (vd2) rebuilding on node f8891810:1003
05/12/2019-20:51:59 [info] volume portainer (vd1) rebuilding on node e08dc3c4:1003
05/12/2019-20:51:59 [info] volume portainer (vd1) volume rebuild completed, ret:0:1020
05/12/2019-20:52:00 [info] vd0 volume rebuild completed, ret:0:1020
05/12/2019-20:52:01 [info] volume wp_mysql-data (vd2) volume rebuild completed, ret:0:1020
05/12/2019-20:52:08 [info] volume wp_mysql-data (vd2) locality rebuild completed, ret:0:1020
```
Data redundancy was automatially restored for all volumes using resources of the remaining nodes. 

<h3>Node recovery</h3>
Next we check node status with <code>cio node ls</code>. We find that node v3 was 'recoverable' and was automatically added back to the cluster for operation.

```
root@v1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
v1                   192.168.3.36      f8891810   sds        normal
v2                   192.168.3.141     e08dc3c4   backup1    normal
v3                   192.168.3.160     6a41aeba   backup2    normal
v4                   192.168.3.69      75472452   standard   normal
```

That's amazing! When node v3 failed, the database was restarted onto a new node, data redundancy for the volumes were restored, and the failed node recovered ... all without operator involvement.
