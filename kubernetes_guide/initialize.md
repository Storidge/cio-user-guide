---
title: Initialize cluster
description: Create persistent storage cluster for Kubernetes
lang: en-US
---

# Initialize cluster

With the cio software installed on all nodes, the next step is to configure a cluster and then initialize the cluster for use. As part of cluster creation, cio will automatically discover and add drive resources from each node into a storage pool. Drives that are partitioned or have a file system will not be added.

<h2>1. Create cluster</h2>

Start configuring a cio storage cluster with the `cioctl create` command. This generates two command strings.

The `cioctl join` command string is used to configure additional nodes into the cluster. After configuration, the `cioctl init` command finishes initialization so the cluster is ready for running applications.

Example:
```
[root@c1 ~]# cioctl create
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

Run `kubeadm token create --print-join-command` on a master node. Copy the `kubeadm join ...` c>

Example:
```
root@master:~/examples# kubeadm token create --print-join-command
kubeadm join 192.168.3.21:6443 --token d7817i.flcq83smoad7npnd --discovery-token-ca-cert-hash s>
```

<h2>4. Install kubeconfig and CSI Driver</h2>

Install the kubeconfig file for storidge user and the CSI driver to dynamically provision volum>

Ensure you have the following prerequisites:
- Kubernetes v1.15+
- Storidge CIO cluster
- Enabled `--allow-privileged` on Kubernetes API Server and kubelet
- Set the following feature gates: `--feature-gates=VolumeSnapshotDataSource=true,KubeletPlugin>

On master node run:

```
curl -fsSL ftp://download.storidge.com/pub/ce/update-kubeconfig | sudo bash
```
