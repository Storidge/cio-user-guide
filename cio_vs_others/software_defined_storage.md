# Software Defined Storage
As traditional data centers evolved toward virtualized data centers, hardware centric storage systems started becoming “software defined”. These software defined storage (SDS) implementations were usually delivered as virtual storage appliances, i.e. storage software running in VMs. The designs mostly implemented distributed storage that exported volumes through standard storage interfaces. 

The standard storage interfaces, such as NFS or ISCSI, can be integrated into orchestration systems through volume plugins. As with legacy storage, the applications supported by SDS were mostly monolithic and static. However, cloud native apps are orchestrated, scalable, mobile and storage agnostic.

<h2>Automation</h2>

When SDS first appeared, the need for distributed storage was obvious but implementations were directed at virtualized datacenters which lacked automation. Volumes for applications were manually provisioned through a UI or sometimes through CLI scripting. While volume plugins for SDS can automate provisioning, it does not eliminate the need for manual effort and time to manage the distributed storage systems. Storidge's CIO is architected to automate storage infrastructure management so enterprises can focus on applications.

<h2>Scalability</h2>

Cloud native apps scale vertically. You can run more containers than VMs on the same host resulting in greater contention. 
SDS solutions incur high latency costs running in a VM. This makes is very difficult to manage application performance. While it is possible to set max performance limits to alleviate noisy neighbor issues, it is impossible to guarantee minimum performance. Providing automated performance management for apps is a CIO capability that enables cloud native apps to scale predictably. 

The high latency costs of running storage in a VM also makes it a poor fit for NVMe flash. They can only deliver a small fraction of the performance capability, resuling in inefficient use of resources. CIO's design is optimized for low latency to deliver performance from the fastest storage media.

<h2>Mobility</h2>

Cloud native apps move frequently to different nodes as part of a workflow, batch process, version upgrade, etc. This container movement introduces variable latency as stateful apps access data across a network. While not an issue for many applications, it can be unacceptable for latency sensitive applications, such as databases.

Many SDS implementations use a computed hash to determine an address for data. This binds the data to a fixed location and makes it impossible to use data locality to mitigate network latencies. Storidge's CIO includes both storage orchestration to move a volume to the container and [automated data locality](https://storidge.com/blog/effortless-data-locality-with-storidge/) to ensure frequently accessed data is close to the application.

SDS solutions can be integrated through plugins to provision persistent storage for containerized apps. However as data centers become more software defined and adoption of low latency devices and protocols such as NVME ramps, SDS solutions running in VMs face a lot of challenges. Truly addressing the needs of enterprises who want to modernize their storage infrastructure is why Storidge developed CIO.
