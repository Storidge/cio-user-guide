---
title: Cloud native storage for containers
description: Compare cloud native storage and Storidge persistent storage for containers
lang: en-US
---

# Cloud Native Storage

Stateful cloud native apps present new challenges for storage and data management. These containerized apps run in orchestrated environments, are highly scalable, short lived and mobile. Given these unique challenges, a number of startups concluded that a purpose built storage solution is the right approach for cloud native apps. Cloud native storage generally demonstates deeper integration with orchestration systems, with some solutions interacting at the container runtime level, and some adding capabilities through custom API extensions.

While the goals are similar, cloud native storage implementations differ greatly in terms of operational impact and benefits.

## Automation
Legacy storage was developed for applications which were monolithic, static and operated in manually administered environments. On the other hand, cloud native apps are composed of dynamic, orchestrated microservices making legacy storage a poor fit. When SDS came along, the need for distributed storage was more obvious but was developed for a virtualized datacenter which still lacked automation. As a new entrant, cloud native storage has the advantage of being developed assuming an orchestrated environment.

Cloud native storage is therefore more tightly integrated into orchestration systems, with automated and faster provisioning for applications. However the automation of backend storage operations is equally important (e.g. operational effort to resolve drive and node failures). This automation has an outsized impact on operational responsiveness and efficiency. Storidge CIO is the first automated storage stack that was designed to minimize the need for storage infrastructure operations, and be deployable as part of an application stack.

## Data Locality

Schedulers in orchestration systems restart containers on different nodes as part of a workflow, batch process, version upgrade, etc. This container movement introduces variable latency as stateful apps access data across a network. While not an issue for many applications, it can be unacceptable for latency sensitive applications such as databases.

Cloud native storage assigning volume replicas to fixed nodes have limited flexibility to mitigate latency issues. Node constraints can be placed to select failover nodes and ensure data locality, but requires operational effort to maintain. Alternatively API extensions can be used to coordinate the scheduler but requires a new component to be installed and maintained. Storidge's CIO includes both storage orchestration and [automated data locality](https://storidge.com/blog/effortless-data-locality-with-storidge/). No node constraints or API extensions are used to keep frequently accessed data close to the application.

## Performance Guarantees

Compared to VMs, you can run a lot more containers on the same host resulting in greater contention for performance. Ensuring consistent performance is a "day two" operational reality that hits production clusters.

While some cloud native storage support 'high' and 'low' performance settings, almost all do not provide minimum performance guarantees. Storidge's CIO ensures logical and performance isolation between adjacent applications. Performance boundaries can be set or changed to meet growing demands. Minimum performance guarantees allow operations to easily manage and scale application performance predictably.

## New and Old Apps

Most enterprises have a big investment in existing applications and infrastructure. While containerizing legacy apps and migrating to microservices architecture is a priority, certain applications may never get ported. This could be because of no source code access, staff no longer available to help, code base is too costly to migrate, etc.

Cloud native storage solutions that are tied to a container runtime works only with containerized applications. This results in customers having to employ different tools, practices and platforms for different groups or business units. Storidge's CIO works with existing applications while also supporting enterprises deploying cloud native applications.
