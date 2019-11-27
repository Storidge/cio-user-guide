---
title: Software updates
description: Performing software updates on a Storidge cluster
lang: en-US
---

# Software updates

The Storidge CIO software is constantly being updated with new features, integrations, improvements and bug fixes. Storidge supports cluster aware updates so users can easily upgrade to the latest capabilities. Cluster aware updating upgrade nodes to the latest software releases, while the cluster is online and services continue to run.

`cioctl node update` updates the Storidge software components and dependencies on a node. When the command is run, it checks for any software update. If an update is available, it performs the following sequence:

1. Cordon node, setting it into maintenance mode
2. Drain node, so services are moved to operating nodes
3. Download latest software release to /var/lib/storidge
4. Install software update and any dependencies
5. Reboot node
6. Uncordon node to exit maintenance mode, and rejoin cluster

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
