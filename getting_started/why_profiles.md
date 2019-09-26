---
title: Why profiles for persistent storage
description: Why use profiles to create persistent storage for Docker Swarm and Kubernetes
lang: en-US
---

# Why profiles

CIO makes it really easy to manage storage through the concept of profiles. Profiles provide a simple way to declare application requirements through YAML formatted files.

Profiles already tuned for specific use cases can be saved and reused, making it easier to deliver repeatable and consistent services.

Passing volume options through a profile is easier, e.g. instead of:
```
$ docker volume create --name data \
--driver cio \
--opt capacity=200 \
--opt directory=/cio/dbdata \
--opt iopsmin=2000 \
--opt iopsmax=8000 \
--opt level=2 \
--opt type=ssd \
--opt snapshot=yes \
--opt interval=60 \
--opt snapshotMax=10
```
with a profile, run:
```
$ docker volume create --driver cio --name data --opt profile=DBDATA
```
Using profiles is much simpler. It is also easier to be consistent as profiles can be defined and used for applications, different classes of service, frameworks, customers, etc.

See the next topic for how to create and use profiles.
