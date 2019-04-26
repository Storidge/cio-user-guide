# Teardown

We've deployed a fully functional cio storage cluster that can be used for basic web development and testing. However if it is time to switch gears and do something else, how do we halt or remove the storage cluster?

## Shutdown cluster
Stopping the cluster by running the `cioctl shutdown` command will gracefully shut down the cio cluster, the operating system and power down the cluster nodes. Restart the nodes when you are ready to boot and reform the storage cluster. The benefit of this method is that it will cleanly shut down your instances, preserving the contents of drive resources, and allowing it to be cleanly started again. The downside is that it'll take some extra time to start from a cold boot, and the instances still consume drive resources while powered off.

## Reboot cluster

Rebooting the cluster with `cioctl reboot` will shut down the cluster as specified above and immediately restart it again.

## Remove cluster
Running `cioctl create` will erase the cio metadata, remove nodes from the cluster and free up the drive resources provisioned for the cluster nodes. After the cio cluster is removed, the cluster nodes will be rebooted. At this point, the nodes can be consumed for other tasks, or powered down and removed to free resources.
