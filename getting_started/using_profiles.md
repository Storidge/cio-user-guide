# Using profiles

<h3>List profiles</h3>

CIO comes installed with some example profiles. List the installed profiles with.
```
$ cio profile ls
```

<h3>Inspect profile</h3>

Display GOLD profile
```
$ cio profile info GOLD
```

Save GOLD profile to file TEST in your current working directory.
```
$ cio profile info GOLD > TEST
```

<h3>Save profile</h3>

Edit profile TEST with your editor and save it to the cio datastore.
```
$ cio profile add TEST
```

<h3>Create volume</h3>

You can create a volume with the TEST profile using the `--opt` flag in a `docker volume create` command.
```
$ docker volume create --driver cio --name test --opt profile=TEST
```
Use with volume option in `docker run` command.
```
$ docker run -it --mount source=test,target=/tmp,volume-driver=cio,volume-opt=profile=TEST \
--name test alpine sh
```
Use with `--mount` flag in a `docker service create` command.
```
$ docker service create \
--mount source=test,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=TEST \
--replicas 1 \
--detach=false \
-e MYSQL_ROOT_PASSWORD=mysecret \
--name mysql \
mysql
```
To use a profile in a `cio volume create` command, simply reference it using the `-p` or `--profile` flag in a$
```
$ cio volume create test --profile TEST
```

<h3>Remove profile</h3>

```
$ cio profile rm TEST
```

