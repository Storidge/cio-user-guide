---
title: Using volumes
description: Create docker volume with Storidge for stateful applications
lang: en-US
---

# Using volumes

Volumes are used by applications for persistent storage.

<h3>Create volumes</h3>

Volumes can be created using the `cio volume create` command with the following options:

```
volume create parameters

--autoexpand                        enable auto capacity expansion
--bandwidthmin <min BW>             set min bandwidth in MiB/s
--bandwidthmax <max BW>             set max bandwidth in MiB/s
-c | --capacity <size in GB>        volume size in GB
-d | --dedupe                       enable de-duplication
-D | --directory <directory>        set bind mount directory for Docker, defaults to /cio
-e | --encryption                   enable encryption
-f | --filesystem <filesystemtype>  set a filesystem for this volume
-h | --help                         show usage information
--increment                         set percentage capacity to auto expand
--iopsmin <min IOPS>                set min IOPS
--iopsmax <max IOPS>                set max IOPS
-I | --interface interface_params   set interface parameters
--interval <snapshot interval>      snapshot interval in minutes
--label key'='value                 set a label on this volume
-l | --level <2 | 3>                set redundancy level to 2 copy or 3 copy
--limit                             limit number of times capacity automatically increase
-m | --compress                     enable compression
-n | --node <nodename>              create volume on named node
-N | --nodeid <nodeid>              create volume on named node
-o | --local                        create volume with drives of local node
-p | --profile <profile>            use profile to add volume
-P | --provision <thin | thick>     select thin or thick provisioned volume
-q | --quiet                        display the assigned vdisk ID
-s | --snapshot                     create volume with snapshot enabled
--snapshotMax <max snapshots>       maximum number of snapshots
--threshold                         set percentage capacity when expansion is triggered
-t | --type <SSD | HDD>             set backend drive type
-v | --volume <volumename>          volume name
```

Below is an example of how to create a volume with the name “foo”, size 35GB, min/max IOPS of 100 and 2000, and thick provisioning:

```
$ cio volume create foo -c 35 --iopsmin 100 --iopsmax 2000 -P thick
Succeed: Add vd2: Type:2-copy, Size:35GB
```

The above example creates a block device /dev/vdisk/vd2 which could be useful for applications such as databases that want to work with raw devices.  

Upon execution, CIO automatically allocates the capacity to provision the volume, format a filesystem, and mount it. The filesystem is accessible through /cio/volumes/$ID by default, where $ID represents the volume number. In the above example, the $ID is ‘vd2’.

To create a volume with a different bind mount directory, use the `-D` or `--directory` flag. The following example creates a volume with the same configuration as in the last example but at directory /cio/foo

```
$ cio volume create foo -c 35 --iopsmin 100 --iopsmax 2000 -P thick -D /cio/foo
Succeed: Add vd2: Type:2-copy, Size:35GB
```

If all parameters are left blank, then a volume is created with default parameters shown below:

```
$ cio volume create
Succeed: Add vd2: Type:2-copy, Size:20GB
```

<h3>Inspect volumes</h3>

Upon creation, a volume is instantly available for use. It can also be inspected, moved, modified or removed. Metadata about a volume is displayed with the `cio volume info` command shown below:

```
$ cio volume info -V 2
vdisk                          2
uuid                           65854342
node                           u2
ipaddr                         192.168.1.137
nodeid                         fc29922d
name                           
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
labels                         
allocated                      0.2%
```

<h3>List Volumes</h3>

A list of volumes on a cluster can be viewed using the command `cio volume ls`:

```
$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
u3                   vd1       SSD   2-copy                  20GB  32621920  portainer         
u1                   vd2       SSD   3-copy                  10GB  6fd038a5  wp_mysql-data   
```

<h3>Clone Volumes</h3>

To clone an existing volume, run `cio volume clone <SOURCEVOLUMENAME> <DESTINATIONVOLUMENAME>`

```
$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
c1                   vd1       SSD   2-copy                  20GB  a94fb4a2  foo

$ cio volume clone foo newFoo
Success: This operation will take some time. Run 'cio events' for completion status.

$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
c1                   vd1       SSD   2-copy                  20GB  a94fb4a2  foo
c1                   vd1       SSD   2-copy                  20GB  a94fb4a2  newFoo
```

<h3>Update volumes</h3>

To modify the parameters of a volume, such as the capacity and the IOPS, use the command `cio volume update $volume_name`. It takes the same parameters as `volume create`, except a target volume is mandatory.
For example, this command will update the capacity of the portainer volume from 20GB to 25 GB:

```
$ cio volume update portainer -c 25
Succeed: Update vd1 capacity: increased to 25GB
```

<h3>Remove volumes</h3>

Finally, to delete a volume, simply use `cio volume rm $volume_name`. You must confirm that the volume being deleted is correct. To skip the prompt, use the -y flag. Example:

```
$ cio volume rm foo
This operation will remove the vdisk and delete all existing data! Please confirm you wish to proceed [Y/N]: Y
Succeed: Remove vd2
```
