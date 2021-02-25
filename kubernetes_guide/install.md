---
title: Install cio
description: Install persistent storage for Kubernetes cluster
lang: en-US
---
<h1>Install cio</h1>

After verifying you have a supported distribution, run the convenience script below to begin installation.

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
FTP access may not be allowed from certain countries or locations. Try using http to download and install:

`curl -fsSL http://download.storidge.com/pub/ce/cio-ce | sudo bash`
:::

Example:
```
root@demo:~# curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash
Started installing release 2859 at Tue Jul  9 13:05:15 PDT 2019
Loading cio software for: u16  (4.4.0-148-generic)
Reading package lists... Done
Building dependency tree
.
.
.
Finished at Tue Jul  9 13:08:39 PDT 2019

Installation completed. cio requires a minimum of 3 local drives per node for data redundancy.

To start a cluster, run 'cioctl create' on primary node. To add a node, generate a join token
with 'cioctl join-token' on sds node. Then run the 'cioctl node add ...' output on this node.
```

::: warning
The installation requires access to system devices so sudo access or root user is needed
:::

<h3>Add More Nodes</h3>

The cio software will run with just one node in the cluster. This is great if you just want to get a flavor of the capabilities of the software, and do not need high availability or advanced features like automatic data locality.

On the other hand, cio allows you to add more nodes to the cluster to increase performance, capacity and enable high availability for your applications. Repeat the convenience script installation on all nodes that will be included in the cluster. Run:

`curl -fsSL ftp://download.storidge.com/pub/ce/cio-ce | sudo bash`

::: tip
A multi-node configuration requires a minimum of three nodes. Currently two node configurations are not supported.

For production deployments and high availability support, a minimum of four nodes is recommended.
:::

::: warning
When working with virtual servers, it is common to clone off a base image. For multi-node clusters, verify that the ISCSI initiator name on each node is unique after cluster initialization completes.

On Linux, you can show the initiator name with:  `cat /etc/iscsi/initiatorname.iscsi`
:::

<h2>Next</h2>

With software installation completed, you are ready to configure and [initialize a cluster](https://guide.storidge.com/kubernetes_guide/initialize.html).
