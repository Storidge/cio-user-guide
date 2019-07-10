# Remove node

You can remove nodes that are either no longer needed or must be replaced. Before removal, the node is placed in drain state so services are rescheduled. The node is then gracefully stopped and removed from the cluster. Background processes on the remaining nodes will automatically rebuild the data that was on the removed node.

First, identify the name of the node you wish to remove. List the nodes in the cluster with `cio node ls`. Next, tell CIO to remove the node:
```
cioctl node remove NODENAME
```
This starts a process to remove metadata of the node from the rest of the cluster. It also starts a rebuild process to ensure redundancy of data in the rest of the cluster, as storage resources on the removed node are deleted.

A removed node can be added back to the cluster by running a `cioctl join-token` command and then the `cioctl add ...` command string. However the node will be treated as a new node as all previous history has been erased. 

::: tip
When a cluster only has three nodes, CIO disables node removal as a minimum of three nodes are required for data redundancy. 
:::

