---
title: Node maintenance
description: Perform online maintenance for persistent storage cluster
lang: en-US
---

# Node Maintenance

In the lifecycle of a cluster, you may want to upgrade software or hardware components on a node. Storidge supports upgrading nodes while the cluster is online and services continue to run.

The steps below walk through upgrade of a node:

<h3>Cordon node for maintenance</h3>

Use the `cioctl node cordon` command to safely evict all services before performing maintenance on a node. This command puts the node in drain state so services are rescheduled, then the node is isolated from other nodes in the cluster.

First, identify the name of the node you wish to cordon. You can list the nodes in the cluster with `cio node ls`. Next, tell CIO to cordon the node:
```
cioctl node cordon <NODENAME>
```

This command performs sequence below to temporarily remove a worker node from the cluster for maintenance:
1. Cordon worker node, marking the node as unschedulable for new pods
2. Drain worker node to safely evict pods to operating nodes
3. Cordon Storidge node which will show status 'cordoned' in `cio node ls`.

While cordoned, the changed block tracking feature is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster after maintenance.

<h3>Perform maintenance</h3>

In cordoned state, a node is temporarily isolated from the rest of the cluster. Change block tracking is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster.

When the `cioctl node cordon` command returns, you can proceed with maintenance. Perform desired CIO software upgrades, driver updates, hardware replacements, etc.

<h3>Reboot node</h3>

After the node maintenance is completed, you can optionally run `reboot` to clean state the node.

<h3>Uncordon node to rejoin</h3>

With maintenance completed, restore the node to full operation with:
```
cioctl node uncordon <NODENAME>
```
The uncordoned node will rejoin the cluster and exit drain state.

This rejoins the node back to the Storidge cluster and uncordons the node so new pods can be scheduled.

If a node was powered off for maintenance, rebooting a node after maintenance is completed will automatically uncordon the node to rejoin the cluster.

<h3>Extend maintenance window</h3>

When change block tracking is engaged, a maintenance window of 30 minutes is started. At the end of 30 minutes, the cordoned node will be automatically removed from the cluster so rebuilds can be started to restore redundancy.

If additional time is needed, the maintenance window can be extended. To extend time for maintenance up to a maximum of 60 minutes, run:
```
cioctl node extend-time TIME-IN-MINUTES
```

TIME-IN-MINUTES is an int value for the number of minutes to extend.

<h3>Show maintenance window</h3>

To display time left in maintenance window, run:
```
cioctl node show-time
```

Repeat the steps for each node in the cluster, until all member nodes are upgraded.
