---
title: High availability
description: Get effortless high availability for docker services and Kubernetes pods with Storidge
lang: en-US
---

# High availability

When you have services in production, the priority is to run these services continuously or with minimal interruptions. Delivering a consistent level of operational performance for applications is described as providing high availability (HA). Achieving this objective requires the underlying infrastructure to recover from both physical and software component failures with minimal impact to users.

An orchestration system that scales applications across multiple nodes makes it simple to deliver HA for stateless applications. On the other hand, delivering HA for stateful apps is a lot more challenging.

The example below steps through how CIO together with Kubernetes makes high availability for stateful apps easy.

<h3>HA with CIO and Kubernetes</h3>

Kubernetes is a great tool for achieving high availability. If a node fails, the scheduler simply restarts the service on another node ... which is awesome for stateless apps. Stateful apps however require data on the failed node to be available before restarting. CIO will swiftly and and fluidly move the required volume to the new node where the stateful app is restarting. Combined, Kubernetes and CIO make delivering HA for your stateful applications simple.

Using the [StatefulSet example](https://docs.storidge.com/kubernetes_storage/stateful_set.html) we can see the pods and volumes on a 4 node cluster.

```
root@v1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
v1                   192.168.3.36      f8891810   sds        normal
v2                   192.168.3.141     e08dc3c4   backup1    normal
v3                   192.168.3.160     6a41aeba   backup2    normal
v4                   192.168.3.69      75472452   standard   normal

root@v1:~# kubectl get nodes
NAME         STATUS     	ROLES                  		AGE     
master	     Ready   		control-plane,master   		5m15s   
worker1  	 Ready   		<none>                 		5m15s   
worker2      Ready   		<none>                 		5m15s   
worker3      Ready   		<none>                 		5m15s   

```

There are three pods and volumes on this cluster. From the `kubectl get pods` output, we can see the 3 pods are running and ready. From the `cio volume ls` output, we see the PVC's are running on node v1, v2, and v3.
```
root@v1:~# kubectl get pods
NAME           READY            STATUS                RESTARTS            AGE                        
web-0		   1/1				Running				  0					  2m
web-1		   1/1				Running 			  0					  2m
web-2		   1/1				Running  			  0					  2m

root@v1:~# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v1  	             vd1       SSD   2-copy                   1GB  32bb17ab  pvc-ffab26ce-2b09-4d5f-accb-24911374f777
v2                   vd2       SSD   2-copy                   1GB  0c763db4  pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903
v3                   vd3       SSD   2-copy                   1GB  4ac2b383  pvc-3059d657-9743-429f-9a76-d7e59bf86ed9

```

We force a failure of the database service by power cycling or rebooting node v3. `watch kubectl get pods` shows that the pod that was on node v3 is now Terminating.
```
root@v1:~# watch kubectl get pods
NAME           READY            STATUS                RESTARTS            AGE                        
web-0		   1/1				Running				  0					  2m
web-1		   1/1				Running 			  0					  2m
web-2		   0/1				Terminating  		  0					  2m

```

Continue watching and we will see that the pod status will change from Terminating to ContainerCreating. It will then change to Running and the status of the pod will be back to Ready. `cio node ls` shows that node v3 is now cordoned and `kubectl get nodes` shows that worker2 is NotReady.

```
root@v1:~# watch kubectl get pods
NAME           READY            STATUS                RESTARTS            AGE                        
web-0		   1/1				Running				  0					  2m
web-1		   1/1				Running 			  0					  2m
web-2		   0/1				ContainerCreating  	  0					  2m

root@v1:~# watch kubectl get pods
NAME           READY            STATUS                RESTARTS            AGE                        
web-0		   1/1				Running				  0					  2m
web-1		   1/1				Running 			  0					  2m
web-2		   1/1				Running  	  		  0					  2m

root@v1:~# cio node ls
NODENAME             IP                NODE_ID    	ROLE       	STATUS
v1                   192.168.3.36      f8891810   	sds        	normal
v2                   192.168.3.141     e08dc3c4   	backup1    	normal
v3                   192.168.3.160     6a41aeba   	backup2    	cordoned
v4                   192.168.3.69      75472452   	standard   	normal

root@v1:~# kubectl get nodes
NAME         STATUS     						ROLES                  AGE     
master	     Ready   							control-plane,master   5m15s   
worker1  	 Ready   							<none>                 5m15s   
worker2      NotReady,SchedulingDisabled   		<none>                 5m15s  
worker3      Ready   							<none>                 5m15s   

```

When we check the web service again, we find that the CIO storage orchestrator has moved the volume to node v2. This enables the scheduler to restart the web service on node v2.
```
root@v1:~# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v1  	             vd1       SSD   2-copy                   1GB  32bb17ab  pvc-ffab26ce-2b09-4d5f-accb-24911374f777
v2                   vd2       SSD   2-copy                   1GB  0c763db4  pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903
v2                   vd3       SSD   2-copy                   1GB  4ac2b383  pvc-3059d657-9743-429f-9a76-d7e59bf86ed9

```

So in less than a minute, the web service is automatically back up and running!

<h3>Data recovery</h3>
It's great that the database service is available again, but what happened to the data that was on node v3? Checking the event log with <code>cio events</code>, we find:
<ol>
  <li>There was a node failover event</li>
  <li>Rebuild processes were started to restore data redundancy</li>
  <li>The volume rebuilds were completed successfully</li>
  <li>The volume had a <a href="https://storidge.com/blog/effortless-data-locality-with-storidge/">locality rebuild</a> making data local to ensure consisent performance</li>
</ol>

```
root@v1:~# cio events
03/01/2021-08:48:52 [info] [DFS] volume vd0_b112db0d (vd0) created on node 13dabee6:1009
03/01/2021-08:54:26 [info] [DFS] volume pvc-ffab26ce-2b09-4d5f-accb-24911374f777 (vd1) created on node ff9977f0:1009
03/01/2021-08:54:29 [info] [DFS] volume pvc-ffab26ce-2b09-4d5f-accb-24911374f777 (vd1) created on node 13dabee6:1009
03/01/2021-08:54:29 [info] [DFS] volume pvc-ffab26ce-2b09-4d5f-accb-24911374f777 (vd1) removed on node ff9977f0:1011
03/01/2021-08:54:34 [info] [VD] volume pvc-ffab26ce-2b09-4d5f-accb-24911374f777 (vd1) locality rebuild completed, ret:0:1021
03/01/2021-08:54:51 [info] [DFS] volume pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903 (vd2) created on node ff9977f0:1009
03/01/2021-08:54:54 [info] [DFS] volume pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903 (vd2) created on node f6726f48:1009
03/01/2021-08:54:54 [info] [DFS] volume pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903 (vd2) removed on node ff9977f0:1011
03/01/2021-08:55:02 [info] [VD] volume pvc-7c8f39fb-74e3-4f2f-9495-5e9c5c475903 (vd2) locality rebuild completed, ret:0:1021
03/01/2021-08:55:04 [info] [DFS] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) created on node ff9977f0:1009
03/01/2021-08:55:06 [info] [DFS] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) created on node bce5139c:1009
03/01/2021-08:55:06 [info] [DFS] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) removed on node ff9977f0:1011
03/01/2021-08:55:11 [info] [VD] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) locality rebuild completed, ret:0:1021
03/01/2021-09:02:54 [info] [DFS] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) created on node f6726f48:1009
03/01/2021-09:02:54 [info] [DFS] volume pvc-3059d657-9743-429f-9a76-d7e59bf86ed9 (vd3) removed on node bce5139c:1011
03/01/2021-09:03:00 [warning] [DFS] ID bce5139c node is cordoned:2010
03/01/2021-09:03:00 [info] [DFS] ID bce5139c node will exit:1002
03/01/2021-09:03:03 [info] [DFS] node (bce5139c) failover completed. hostname=c-f6726f48, ip address=172.31.40.3 :1019

```
Data redundancy was automatially restored for all volumes using resources of the remaining nodes.

<h3>Node recovery</h3>
Next we check node status with <code>cio node ls</code>. We find that node v3 was 'recoverable' and was automatically added back to the cluster for operation. And when we check the node status with <code>kubectl get nodes</code>, we can see that worker2 is back to a Ready status.

```
root@v1:~# cio node ls
NODENAME             IP                NODE_ID    ROLE       STATUS
v1                   192.168.3.36      f8891810   sds        normal
v2                   192.168.3.141     e08dc3c4   backup1    normal
v3                   192.168.3.160     6a41aeba   backup2    normal
v4                   192.168.3.69      75472452   standard   normal

root@v1:~# kubectl get nodes
NAME         STATUS     	ROLES                  AGE     
master	     Ready   		control-plane,master   9m10s   
worker1  	 Ready   		<none>                 9m10s   
worker2      Ready   		<none>                 9m10s   
worker3      Ready   		<none>                 9m10s   

```

That's amazing! When node v3 failed, the database was restarted onto a new node, data redundancy for the volumes were restored, and the failed node recovered ... all without operator involvement.
