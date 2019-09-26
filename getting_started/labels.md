---
title: Add labels to docker volumes and persistent storage
description: Add tagging, versioning, staging labels to docker volumes and persistent storage
lang: en-US
---

# Using labels

CIO supports volume labels which can be useful for tagging, versioning, staging notes, licensing information, and general organization. Labels are key-value pairs. They can be viewed by running `cio volume info`. Here is an example of labels in use:

```
$ cio volume create foo --label some=label --label another=label
Succeed: Add vd2: Type:2-copy, Size:20GB

$ cio volume info foo
vdisk                          2
uuid                           00027368
node                           u3
ipaddr                         192.168.1.138
nodeid                         6b272a64
name                           foo
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     
labels                         some=label@another=label@
allocated                      0.2%
```

Currently, once a label is set, it cannot be removed – only updated, using `cio volume update` command. In the following example you can see that the label value has been updated for the key "some":

```
$ cio volume update foo --label some=other
Succeed: Update vd2 labels

$ cio volume info foo
vdisk                          2
uuid                           00027368
node                           u3
ipaddr                         192.168.1.138
nodeid                         6b272a64
name                           foo
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     
labels                         some=other@another=label@
allocated                      0.2%
```
