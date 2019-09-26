---
title: Auto expand docker volume capacity
description: Use auto capacity expansion to avoid application disruption on Docker Swarm and Kubernetes
lang: en-US
---

# Using auto capacity expansion

The auto expansion service ensures applications are not stopped because they ran out of space on a volume. While the CIO software provide notification events at 70, 80 and 90% volume capacity full, an operator must still respond and issue the commands to resize a volume. 

With the auto expansion service, when a pre-defined capacity threshold is crossed, the volume is automatically increased at both the block and file system level. The capacity expansion happens while the application is online, which means there is no disruption to the application.

<h3>Create auto expand volume from CLI</h3>

Enable auto expansion for a volume by using the `--autoexpand` flag during volume creation. Specify the threshold percentage when expansion will be triggered, the percentage capacity to increase, and how many times a volume is allowed to be expanded, e.g.

```
$ cio volume create auto --capacity 2 --autoexpand yes --threshold 70 --increment 25 --limit 3
Succeed: Add vd2: Type:2-copy, Size:2GB
```

<h3>Create auto expand volume from profile</h3>

You can also use a profile to set the auto expansion parameters for creating a volume. The example below enables auto expansion, sets expansion to trigger at 70% capacity threshold, increases capacity by 25% each time, and caps the number of expansions to 3:

```
capacity: 2
directory: /cio/auto
iops:
  min: 100
  max: 2000
level: 2
local: no
provision: thin
type: ssd
service:
  autoexpand:
    enabled: yes
    threshold: 70
    increment: 25
    limit: 3
  compression:
    enabled: no
    algorithm: lzo
  encryption:
    enabled: no
  replication:
    enabled: no
    destination: none
    interval: 120
```

Save the profile as AUTO with `cio profile create AUTO`.

Create a volume with profile AUTO by running `cio volume create auto -p AUTO`.

<h3>Inspect volume</h3>

Confirm the auto expansion parameters with:

```
$ cio volume info auto
vdisk                          2
uuid                           6fb5f248
node                           c3
ipaddr                         192.168.3.142
nodeid                         25c1cec6
name                           auto
capacity                       2GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   100
maximum iops                   2000
directory                      /cio/auto/vd2
autoexpand enabled             yes
autoexpand threshold           70
autoexpand increment           25
autoexpand limit               3
autoexpand count               0
encryption                     disabled
snapshot                       disabled
snapshot interval              60
maximum snapshots              10
filesystem                     xfs
labels
allocated                      3.9%
```

<h3>Update auto expansion service</h3>

Once the limit for the number of automatic capacity expansions is reached, the autoexpand service will be disabled. You can re-enable the auto expansion service for a volume with:
```
cio volume update VOLUMENAME --autoexpand yes
```

With the auto expansion service, there are no more worries about individual applications running out of space. Life is much easier because you only need to monitor the capacity of the storage pool.
