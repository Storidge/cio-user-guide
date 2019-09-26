---
title: Enterprise Storage Systems
description: Compare enterprise storage system and Storidge persistent storage for containers
lang: en-US
---

# Enterprise Storage Systems

Enterprise storage systems (including SAN and NAS) have a long and proven history in virtualized data centers. Using existing networked storage for stateful applications is an easy choice as investments have already been made, trained staff are available and data services in these legacy systems work. The only new requirement are volume plugins to integrate legacy storage into orchestration systems.

While legacy storage can be integrated through plugins, the complexity, lack of scalability, need for expensive skill sets and time consuming procedures remains. This directly conflicts with the efficiency, agility and speed benefits that adopting container technology delivers. This is why Storidge purpose built a new distributed storage solution for cloud native apps.

Unlike legacy applications, cloud native apps are orchestrated, scalable, mobile and storage agnostic.

## Automation

While plugins for legacy storage automates provisioning, it does not eliminate the need for expertise and time to manage storage infrastructure manually. Storidge's CIO is architected to automate storage operations and eliminate infrastructure management, so enterprises can focus on applications.

## Scalability

Cloud native apps scale horizontally. Most legacy storage systems are dual controller data silos making them a poor fit. In addition, cloud native apps scale vertically. You can run a lot more containers than VMs on the same host resulting in greater contention. Delivering consistent performance for applications and managing "noisy neighbors" are issues that are expensive to manage for legacy storage. Automated performance isolation between adjacent apps is a core CIO capability that makes it simple to deliver guaranteed performance for applications.

Most legacy storage systems were architectured when hard drives were the main storage media. As technology has advanced to faster media using flash memory, and newer interfaces like NVMe, the [limitations of a traditional storage stack](https://searchstorage.techtarget.com/opinion/Understanding-the-NVMe-performance-problem) is exposed. They are only capable of delivering a small fraction of the performance capability in NVMe flash. CIO's design is optimized for low latency, so it can efficiently deliver performance from the fastest storage media.

## Mobility

Cloud native apps move frequently to different nodes as part of a workflow, batch process, version upgrade, etc. Legacy storage and protocols were not designed to work consistently in such dynamic environments. Storidge's CIO includes both storage orchestration to move a volume to the container and [automated data locality](https://storidge.com/blog/effortless-data-locality-with-storidge/) to ensure frequently accessed data is close to the application.

## Storage Agnostic

Legacy storage are usually optimized for block or file storage and may support both. On the other hand, cloud native apps are storage agnostic and utilizes datastores that best fit the data type. Storidge's CIO is designed to deliver storage-as-a-service with profiles that allow applications to declare their storage requirements.

Enterprise storage systems is a near term option for containerized apps. As enterprises progress on their journey toward a software defined data center, it is not the best path forward. Truly addressing the needs of enterprises who want to modernize their storage infrastructure is why Storidge developed CIO.
