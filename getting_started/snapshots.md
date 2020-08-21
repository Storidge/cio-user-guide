---
title: Using snapshots
description: How to use snapshots to protect data for Docker Swarm and Kubernetes
lang: en-US
---

# Using snapshots

A snapshot is a copy of the volume's content at a particular point in time. You can use snapshots to protect against data loss. Snapshots are also useful for test environments. You can test data using the snapshot without changing the actual volume.

<h3>Create manual snapshots</h3>

To create snapshots of a volume, the snapshot capability must first be enabled. This is accomplished with the `-s` or `--snapshot` flag during volume creation:

```
$ cio volume create foo --snapshot yes
Succeed: Add vd2: Type:2-copy, Size:20GB
```

Enabling snapshots allows you to create a snapshot of a volume whenever you want by running:

```
$ cio snapshot create foo
Succeed: Created a snapshot of '/cio/vd2' in '/cio/vd2/.snap/2019-04-28-0345-053cc45e-0000002'
```

<h3>Create rotating snapshots</h3>

You can also create a volume that will snapshot at periodic intervals. The following example creates a volume which will snapshot every hour and keep a maximum of 10 most recent snapshots:

```
$ cio volume create foo --snapshot yes --interval 60 --snapshotMax 10
Succeed: Add vd2: Type:2-copy, Size:20G
```
With periodic snapshots, the oldest snapshot is automatically removed when the maximum number of snapshots is reached and a new snapshot created.

<h3>List snapshots</h3>

Snapshots of a volume can be listed using `cio snapshot ls $volume_name`:

```
$ cio snapshot ls vol
SNAPSHOT                           DATE                    DESCRIPTION
2019-04-28-1340-20b9b305-0000003   Sun Apr 28 13:40 2019   Rotating snapshot with auto cleanup
2019-04-28-1341-20b9b305-0000003   Sun Apr 28 13:41 2019   Rotating snapshot with auto cleanup
2019-04-28-1342-20b9b305-0000003   Sun Apr 28 13:42 2019   Rotating snapshot with auto cleanup
2019-04-28-1343-20b9b305-0000003   Sun Apr 28 13:43 2019   Rotating snapshot with auto cleanup
2019-04-28-1344-20b9b305-0000003   Sun Apr 28 13:44 2019   Rotating snapshot with auto cleanup
```

<h3>Inspect snapshots</h3>

To display the details of a particular snapshot run `cio snapshot info $snapshot_id`:

```
$ cio snapshot info 2019-04-28-1340-20b9b305-0000003
snapshot: 2019-04-28-1340-20b9b305-0000003
source id: 3
type: rotating
directory: /cio/d/vd3/.snap/2019-04-28-1340-20b9b305-0000003
time: Sun Apr 28 13:40 2019
source: vol
description: Rotating snapshot with auto cleanup
```

<h3>Rollback Snapshots</h3>

Revert your volume state to a previous snapshot using `cio snapshot rollback <YYYY-MM-DD-HHMM-NODEID-VDID>`

```
$ cio snapshot rollback 2020-01-28-0052-816a0c7d-0000003
Succeed: Rolled back volume snap at /cio/snap/vd3 to snapshot 2020-01-28-0052-816a0c7d-0000003
```

<h3>Delete snapshots</h3>

Snapshots can be deleted by running `cio snapshot rm $snapshot_id`:

```
# cio snapshot rm 2019-04-21-1626-2c19b9f6-0000005
Delete snapshot on volume rotate at '/cio/snap/vd5/.snap/2019-04-21-1626-2c19b9f6-0000005'
```
