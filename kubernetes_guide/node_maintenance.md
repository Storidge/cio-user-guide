---
title: Node maintenance
description: Perform online maintenance for persistent storage cluster
lang: en-US
---

# Node maintenance

In the lifecycle of a cluster, you may want to upgrade software or hardware components on a node. Storidge supports upgrading nodes while the cluster is online and services continue to run.

The steps below walk through upgrade of a node:

<h3>Cordon node</h3>

Use the `cioctl node cordon` command to safely evict all services before performing maintenance on a node. This command puts the node in drain state so services are rescheduled, then the node is isolated from other nodes in the cluster.

First, identify the name of the node you wish to cordon. You can list the nodes in the cluster with `cio node ls`. Next, tell CIO to cordon the node:
```
cioctl node cordon NODENAME
```

<h3>Perform maintenance</h3>

In cordoned state, a node is temporarily isolated from the rest of the cluster. Change block tracking is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster.

When the `cioctl node cordon` command returns, you can proceed with maintenance. Perform desired CIO software upgrades, driver updates, hardware replacements, etc.

<h3>Reboot node</h3>

After the node maintenance is completed, you can optionally run `reboot` to clean state the node.

<h3>Uncordon node</h3>

With maintenance completed, restore the node to full operation with:
```
cioctl node uncordon NODENAME
```
The uncordoned node will rejoin the cluster and exit drain state.


Repeat the steps for each node in the cluster, until all member nodes are upgraded.
