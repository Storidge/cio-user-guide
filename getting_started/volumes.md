# Create volumes

Use the `cio volume create` command to create volumes which are used by applications for persistent storage. This command takes the following format:
 
Below is an example of a volume with name “foo”, size 35GB, min/max IOPS of 100 and 2000, and thick provisioning:
 
This above example creates a block device /dev/vdisk/vd1 which could be useful for applications such as databases that want to work with raw devices.  
To create a volume and pass it to an application with a bind mount directory, use the `-D` or `–-directory` flag:  
 
Upon execution, CIO automatically allocates the capacity to provision the volume, format a filesystem and mount it. The filesystem is accessible through /cio/volumes/$ID by default, where $ID represents the volume number. In the above example, the $ID is ‘vd2’. 




volume create parameters

-b | --bandwidth [min BW] <max BW>   set bandwidth boundaries in MB/s, cannot be used at
                                     the same time as --iops
-c | --capacity <size in GB>         vdisk size in GB 
-D | --directory <directory>         set bind mount directory, defaults to /cio/volumes
-i | --iops [min IOPS] <max IOPS>    set IOPS boundaries 
-l | --level <2 | 3>                 set redundancy level to 2 copy or 3 copy 
-n | --node <node name>              create vdisk on named node
-N | --nodeid <node id>              create vdisk on named node
-p | --profile <profile>             use profile to add vdisk
-q | --quiet                         show vdisk ID
-T | --thick                         use thick provisioning
-v | --volume <volume name>          volume name

If all parameters are left blank, then a volume is created with default parameters shown below: 


Upon creation, a volume is instantly available for use. It can also be inspected, moved, modified or removed. Metadata about a volume is displayed with: 
 
The command `cio volume move` moves a volume from its current node to the specified node, if the volume is not open or in use. The command format is:
 
To modify the parameters of a volume, such as the capacity and the IOPS, use the command `cio volume update`. It takes the same parameters as `volume create`, except a target volume is mandatory. 
Finally, to delete a volume, simply use `cio volume remove $volume_name`. You must confirm that the volume being deleted is correct. To skip the prompt, use the -y flag. 

