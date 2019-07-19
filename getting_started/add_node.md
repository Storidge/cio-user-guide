# Add node

Expand available capacity and performance by adding new nodes to a cluster. 

Start the node addition by running the `cioctl join-token` command. This generates a command string for adding a new node. Example:
```
root@t1:~# cioctl join-token
    cioctl node add 192.168.3.122 root c3a504d2
```

Copy and run the command string on the new node to be added: 
```
root@t4:~# cioctl node add 192.168.3.122 root c3a504d2
Adding this node to cluster as a storage node
<13>May 29 14:43:55 cluster: Copy auto-multiNode-t1.cfg to all nodes (NODE_NUMS:4)
<13>May 29 14:43:57 cluster: Initialize target
<13>May 29 14:44:21 cluster: Initialize initiator
<13>May 29 14:44:26 cluster: Node initialization
<13>May 29 14:44:29 node: Clear drives
<13>May 29 14:44:30 node: Load module
<13>May 29 14:44:30 node: Add node backup relationship
<13>May 29 14:44:36 node: Check drives
Adding disk /dev/sdb SSD to storage pool
Adding disk /dev/sdc SSD to storage pool
Adding disk /dev/sdd SSD to storage pool
Adding disk /dev/sde SSD to storage pool
Adding disk /dev/sdr SSD to storage pool
Adding disk /dev/sds SSD to storage pool
Adding disk /dev/sdt SSD to storage pool
Adding disk /dev/sdu SSD to storage pool
Adding disk /dev/sdv SSD to storage pool
Adding disk /dev/sdw SSD to storage pool
Adding disk /dev/sdx SSD to storage pool
Adding disk /dev/sdy SSD to storage pool
Adding disk /dev/sdz SSD to storage pool
Adding disk /dev/sdaa SSD to storage pool
Adding disk /dev/sdab SSD to storage pool
Adding disk /dev/sdac SSD to storage pool
<13>May 29 14:45:04 node: Collect drive IOPS and BW: Total IOPS:22900  Total BW:1833.7MB/s
<13>May 29 14:45:04 node: Initializing metadata
<13>May 29 14:45:09 cluster: Starting cio daemon
<13>May 29 14:45:09 cluster: Starting API
```

The creation of new join tokens will be disabled when there are on-going node operations, e.g. cordon, uncordon or removing a node from cluster. 

Wait for the node operation to complete, then run the join-token command again.



