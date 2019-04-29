# Why profiles

CIO makes it really easy to manage storage through the concept of profiles. Profiles provide a simple way to declare application requirements through YAML formatted files. They can be used to provision storage for applications, different classes of service, frameworks, customers, etc.

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
--opt snapshot=-- \
--opt interval=60 \
--opt snapshotMax=10
```
with a profile, run:
```
$ docker volume create --driver cio --name data --opt profile=DBDATA
```
