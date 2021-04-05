---
title: Initialize cluster
description: Create persistent storage cluster for Kubernetes
lang: en-US
---

# Initialize cluster

With the cio software installed on all nodes, the next step is to configure a cluster and then initialize the cluster for use. As part of cluster creation, cio will automatically discover and add drive resources from each node into a storage pool. Drives that are partitioned or have a file system will not be added.

<h2>1. Create cluster</h2>

Start configuring a cio storage cluster with the `cioctl create --kubernetes` command. This generates two command strings.

The `cioctl join` command string is used to configure additional nodes into the cluster. After configuration, the `cioctl init` command finishes initialization so the cluster is ready for running applications.

Example:
```
[root@c1 ~]# cioctl create --kubernetes
Cluster started. The current node is now the primary controller node. To add a storage node to this cluster, run the following command:
    cioctl join 192.168.3.95 root f26e695d

After adding all storage nodes, return to this node and run following command to initialize the cluster:
    cioctl init f26e695d
```
The first node, from which the `cioctl create` command is run, becomes the sds controller node (c1 in example above). This node is identified as the sds node when the `cio node ls` command is run.

<h2>2. Join nodes to cluster</h2>

The output of the create sub-command includes a `cioctl join` command to add new nodes to the c>

Example four node cluster with new nodes c2, c3, c4:
```
[root@c2 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c3 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node

[root@c4 ~]# cioctl join 192.168.3.95 root f26e695d
Adding this node to cluster as a storage node
```
Return to the sds controller node and run the `cioctl init` command to complete initialization >
```
[root@c1 ~]# cioctl init f26e695d
cluster: initialization started
...
cluster: Node initialization completed
cluster: Start cio daemon
cluster: Succeed: Add vd0: Type:3-copy, Size:20GB
cluster: MongoDB ready
cluster: Synchronizing VID files
cluster: Starting API
```

<h3>Initializing bare metal servers with SSDs</h3>

The initialization process will take a few minutes to complete for virtual servers. The cio software currently does not characterize performance on virtual servers. A 'virtual' IOPS budget is used instead.

When the cio software is installed on physical servers with high performance devices such as SSDs, the first initialization of the cluster will take about 30 minutes. This extra time is used to characterize the available performance. This performance information is used in the quality-of-service (QoS) feature to deliver guaranteed performance for individual applications.

<h2>3. Add to Kubernetes</h2>

Add the worker nodes to the Kubernetes control plane so pods can be scheduled.

Run `kubeadm token create --print-join-command` on a master node. Copy the `kubeadm join ...` command string, and run on each of the worker nodes.

Example:
```
root@master:~/examples# kubeadm token create --print-join-command
kubeadm join 192.168.3.21:6443 --token d7817i.flcq83smoad7npnd --discovery-token-ca-cert-hash sha256:d748737fa0b8f5f9145381cb681f5fbc41a1860ecd805e77cdce93acd92e07f2
```

After the worker nodes have been added, you can confirm with `kubectl get nodes`.

Example:
```
root@master:~# kubectl get nodes
NAME      STATUS   ROLES    AGE     VERSION
kmaster   Ready    master   69d     v1.19.2
worker1   Ready    <none>   4m57s   v1.19.2
worker2   Ready    <none>   18s     v1.19.2
worker3   Ready    <none>   12s     v1.19.2
worker4   Ready    <none>   2m1s    v1.19.2
```

<h2>4. Install kubeconfig and CSI Driver</h2>

Install the kubeconfig file for storidge user and the CSI driver to dynamically provision volumes from Kubernetes. 

Ensure you have the following prerequisites:
- Kubernetes v1.15+
- Storidge CIO cluster
- Enabled `--allow-privileged` on Kubernetes API Server and kubelet

Install the kubeconfig file for storidge user and the CSI driver to dynamically provision volumes from Kubernetes. 

On master node run:

```
curl -fsSL ftp://download.storidge.com/pub/ce/update-kubeconfig | sudo bash
```

Verify that the csi driver has been deployed with `kubectl get pods -A`

Example:
```
root@kmaster:~# kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS        RESTARTS   AGE
default       config-move-5f27j                          1/1     Terminating   0          27s
default       config-move-6lqp4                          1/1     Terminating   0          27s
default       config-move-bhg8n                          1/1     Terminating   0          27s
default       config-move-bqcf5                          1/1     Terminating   0          27s
kube-system   calico-kube-controllers-744cfdf676-65bjr   1/1     Running       5          69d
kube-system   calico-node-567pj                          1/1     Running       0          19d
kube-system   calico-node-gcbrs                          1/1     Running       5          69d
kube-system   calico-node-gkxf5                          1/1     Running       0          68m
kube-system   calico-node-hhw6c                          1/1     Running       0          19d
kube-system   calico-node-thn9g                          1/1     Running       0          19d
kube-system   coredns-f9fd979d6-9tskh                    1/1     Running       5          69d
kube-system   coredns-f9fd979d6-rczkk                    1/1     Running       5          69d
kube-system   csi-cio-27cl7                              2/2     Running       0          9s
kube-system   csi-cio-c4vjc                              2/2     Running       0          9s
kube-system   csi-cio-controller-7967955cfb-8gkf6        6/6     Running       0          10s
kube-system   csi-cio-p56cz                              2/2     Running       0          9s
kube-system   csi-cio-w5rkw                              2/2     Running       0          9s
kube-system   etcd-kmaster                               1/1     Running       5          69d
kube-system   kube-apiserver-kmaster                     1/1     Running       6          69d
kube-system   kube-controller-manager-kmaster            1/1     Running       11         69d
kube-system   kube-proxy-5fgv5                           1/1     Running       0          19d
kube-system   kube-proxy-5q6xx                           1/1     Running       0          68m
kube-system   kube-proxy-9p464                           1/1     Running       5          69d
kube-system   kube-proxy-hl8mq                           1/1     Running       0          19d
kube-system   kube-proxy-wvxhg                           1/1     Running       0          19d
kube-system   kube-scheduler-kmaster                     1/1     Running       10         69d
```

The example above shows the csi-cio-controller and csi-cio drivers deployed on 4 nodes of the kube cluster. 
