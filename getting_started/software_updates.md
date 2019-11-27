---
title: Software updates
description: Performing software updates on a Storidge cluster
lang: en-US
---

# Software updates

The Storidge CIO software is constantly being updated with new features, integrations, improvements and bug fixes. Storidge supports cluster aware updates so users can easily upgrade to the latest capabilities. Cluster aware updating upgrade nodes to the latest software releases, while the cluster is online and services continue to run.

`cioctl node update` will check for any software update. If an update is available, the node is cordoned, services drained to other nodes, update software is downloaded and installed. When the software installation is completed, the node is rebooted and automatically rejoins the cluster.

The `cioctl node update` command will prescribe an update sequence so worker nodes are updated first, and the sds node (primary) is updated last.

For example, to update node worker3 run:
```
root@t5:~# cioctl node update worker3
Release 2915 is available for upgrade
Loading cio software for: u16  (4.4.0-116-generic)
488233b0d7b8
.
.
.
Success: This node has been updated to cio version 1.0.0-2915. This node will be rebooted and automatically rejoin the cluster
```
