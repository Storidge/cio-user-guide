# Introduction to ContainerIO (cio)

Storidge’s CIO (container I/O) software was created to simplify the life of developers, DevOps and storage administrators. Purpose built to remove the pain of managing storage for applications, we make storage simple so you can focus on applications instead of managing infrastructure.

CIO is a clustered block storage solution which is tightly integrated with container orchestrators. It provides a persistent storage layer from which applications can programmatically consume block, file and object storage services. In an orchestrated environment, the data volumes are hyper-converged and exposed on the same host where the application container is running. When a container is rescheduled to another host, the CIO storage orchestrator automatically moves the volume to the new host.

For organizations that want to future-proof their investments in container technology, CIO also supports accessing data volumes from outside the storage cluster. This enables applications running on virtual or physical servers to access the same volumes as the hyper-converged containers.

