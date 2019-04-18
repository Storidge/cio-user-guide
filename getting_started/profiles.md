# Use profiles

CIO makes it really simple to manage storage through the concept of profiles. Profiles provide a way to declare application requirements through YAML formatted files. They can be used to consistently provision storage for applications, different classes of service, frameworks, customers, etc. 
Example profiles can be viewed with `cio profile list`, and inspected with `cio profile info $profile_name`. 

Here is an example of a profile named NGINX:
 
To use a profile, simply reference it using the `--profile` flag. To use the above example, we would use `cio volume create foo --profile NGINX`.

To create your own profile, simply create a named file with desired parameter values, and save it to the datastore with `cio profile create $profile_name`. You can then confirm that your profile was saved using the `cio profile list` command again.

