# Introduction 

Orchestration systems create an abstraction layer on top of a group of hosts, so development teams can quickly deploy applications on logical resources. Similarly, Storidge's Container I/O (CIO) is a tool that creates a storage abstraction layer for stateful applications to persist and share data on logical resources. 

The CIO software runs on virtual machines, cloud instances and bare metal hosts. This means developers can easily create environments for stateful application development and testing that operates the same as production clusters. This flexibility helps eliminate "works on my machine" situations that slow development. 

![cio abstraction layer](../images/cio-abstraction-layer.png)

## Why CIO?
Cloud native apps are orchestrated, scalable, mobile and storage agnostic. These traits make older storage technologies a poor fit. Storidge's CIO was purpose built to solve data management challenges in these new orchestrated environments. It eliminates the manual effort, inconsistencies and tedium in trying to integrate external networked storage to an orchestrated environment. 

Built on a foundation for storage automation, the CIO software makes development teams more productive, and operations teams more efficient.

### For Developers
CIO's abstraction layer isolates dependencies on underlying infrastructure. This enables developers to work within their native environment (e.g. Docker CLI) and focus on writing applications. 

The CIO software can be easily deployed with industry standard tools such as Vagrant and Terraform. For example, once a Vagrantfile is created, other team members can easily create their own development clusters with the same environment, dependencies and configuration. 

### For Operators

CIO's abstraction layer isolates dependencies on underlying infrastructure. For operators this reduces cloud lock-in as applications and data become more portable, and tools, practices and experiences are consistent and reusable across different platforms.

The CIO software runs on virtual machines, cloud instances and bare metal hosts. This flexibility allows developers to write and test applications in environments similar to production. Bringing production environments closer to development shorten release cycles, as problems are discovered and resolved earlier. 
