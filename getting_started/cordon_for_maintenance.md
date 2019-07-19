# Cordon for maintenance

Use the `cioctl node cordon` command to safely evict all services before performing maintenance on a node. This command puts the node in drain state so services are rescheduled, then the node is cordoned from other nodes in the cluster. 

First, identify the name of the node you wish to cordon. You can list the nodes in the cluster with `cio node ls`. Next, tell CIO to cordon the node:
```
cioctl node cordon NODENAME
```

When the command returns, you can perform maintenance on the node (e.g. software or driver updates, hardware maintenance, etc.). In cordoned state, the node is temporarily isolated from the cio cluster. Changed block tracking is engaged to track updates that are destined for the cordoned node. This enables fast rebuilds when the node is rejoined to the cluster. 

After maintenance is completed, restore the node to full operation with:
```
cioctl node uncordon NODENAME
```
The uncordoned node will be automatically re-enabled to run services from the next cordoned node. In this way, each node member is cordoned, updated and uncordoned sequentially, until all node members are updated. 
