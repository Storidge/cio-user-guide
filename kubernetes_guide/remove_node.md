---
title: Remove node
description: Remove storage node from persistent storage cluster for Kubernetes
lang: en-US
---

# Remove node from cluster

You can remove nodes that are either no longer needed or must be replaced. Before removal, the node is placed in drain state so services are rescheduled. The node is then gracefully stopped and removed from the cluster. Background processes on the remaining nodes will automatically rebuild the data that was on the removed node.

First, identify the name of the node you wish to remove. List the nodes in the cluster with `cio node ls`. Next, tell CIO to remove the node:
```
cioctl node remove <NODENAME>
```

This command performs the following sequence:
1. Cordon the node, marking the node as unschedulable for new pods
2. Drain node to safely evict pods to operating nodes
3. Remove node from both Storidge and Kubernetes cluster

Volumes from the removed node are automatically reattached to new nodes where pods are restarting. During the process of exiting the cluster, the node will show status 'leaving' in `cio node ls`.

Since drives on the decommisioned node are also removed, background processes on remaining nodes will automatically rebuild data that was on the removed drives.

::: tip
A minimum of three nodes are required for data redundancy. Storidge prevents removal of nodes when there are only three nodes left in the cluster.
:::

