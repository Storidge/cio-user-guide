---
title: Volume Dynamic Provision
description: Dynamic provisioning of persistent volume claims for Kubernetes workloads with Storidge
lang: en-US
---

# Using dynamic volume provisioning

Dynamic provisioning allows persistent volumes to be created during application deployments. This eliminates having to pre-provision a storage volume, and then creating a persistent volume object to represent it. Using dynamic provisioning, storage is automatically provisioned when requested by users.

Dynamic provisioning requires at least one [storage class](https://docs.storidge.com/kubernetes_storage/storage_classes.html) to be present. Multiple storage classes can be pre-defined to provide different classes of service in the cluster.

This example below goes through three steps to dynamically provision a Storidge volume for a Pod.
1. Create storage class
2. Create persistent volume claim
3. Create pod to consume persistent volume claim

## Dynamic provisioning example

<h3>1. Create storage class</h3>

Save example below as file 'cio-test.yaml'.
```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: cio-test
provisioner: csi.cio.storidge.com
parameters:
  directory: "/cio/test"
  filesystem: "xfs"
  level: "2"
  iopsMin: "100"
  iopsMax: "90000"
  provision: "thin"
  type: "ssd"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

::: tip
This storage class has 'reclaimPolicy: Delete'. The Storidge volume will be removed when the persistent volume claim is deleted. Change to `reclaimPolicy: Retain` when a Storidge volume should be manually deleted.
:::

Create storage class 'cio-test':
```
kubectl create -f cio-test.yaml
```

Verify storage class is created:
```
root@master:~# kubectl describe storageclass cio-test
Name:                  cio-test
IsDefaultClass:        No
Annotations:           <none>
Provisioner:           csi.cio.storidge.com
Parameters:            directory=/cio/test,filesystem=xfs,iopsMax=90000,iopsMin=100,level=2,provision=thin,type=ssd
AllowVolumeExpansion:  True
MountOptions:          <none>
ReclaimPolicy:         Delete
VolumeBindingMode:     Immediate
Events:                <none>
```

The example storage class above includes a few of the parameters supported by Storidge. See the full list of storage attributes supported [here](https://docs.storidge.com/kubernetes_storage/storage_classes.html).

<h3>2. Create pvc</h3>

Save example below as file 'pvc-test.yaml'.
```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-test
spec:
  accessModes:
  - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 20Gi
  storageClassName: cio-test
```

Create persistent volume claim 'pvc-test':
```
kubectl create -f pvc-test.yaml
```

Verify persistent volume claim is created:
```
root@master:~/examples# kubectl describe pvc pvc-test
Name:          pvc-test
Namespace:     default
StorageClass:  cio-test
Status:        Bound
Volume:        pvc-919ff8e9-7731-4910-ae77-7ad5bbdb2f30
Labels:        <none>
Annotations:   pv.kubernetes.io/bind-completed: yes
               pv.kubernetes.io/bound-by-controller: yes
               volume.beta.kubernetes.io/storage-provisioner: csi.cio.storidge.com
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      20Gi
Access Modes:  RWO
VolumeMode:    Filesystem
Mounted By:    <none>
Events:
  Type    Reason                 Age                    From                                                               Message
  ----    ------                 ----                   ----                                                               -------
  Normal  ExternalProvisioning   2m34s (x2 over 2m34s)  persistentvolume-controller                                        waiting for a volume to be created, either by external provisioner "csi.cio.storidge.com" or manually created by system administrator
  Normal  Provisioning           2m34s                  csi.cio.storidge.com_worker3_f632eea0-e14e-42a5-b333-5839e2a1210a  External provisioner is provisioning volume for claim "default/pvc-test"
  Normal  ProvisioningSucceeded  2m32s                  csi.cio.storidge.com_worker3_f632eea0-e14e-42a5-b333-5839e2a1210a  Successfully provisioned volume pvc-919ff8e9-7731-4910-ae77-7ad5bbdb2f30
```

Verify persistent volume is created and bound:
```
root@master:~/examples# kubectl describe pv pvc-919ff8e9-7731-4910-ae77-7ad5bbdb2f30
Name:            pvc-919ff8e9-7731-4910-ae77-7ad5bbdb2f30
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.cio.storidge.com
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    cio-test
Status:          Bound
Claim:           default/pvc-test
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        20Gi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.cio.storidge.com
    VolumeHandle:      pvc-919ff8e9-7731-4910-ae77-7ad5bbdb2f30
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1580029721629-8081-csi.cio.storidge.com
Events:                <none>
```

<h3>3. Create pod to consume pvc</h3>

Save example below as file 'pod-test.yaml'.
```
apiVersion: v1
kind: Pod
metadata:
  name: pod-test
spec:
  containers:
   - name: web-server
     image: wordpress
     volumeMounts:
       - name: wordpress-vol
         mountPath: /var/lib/www/html
  volumes:
   - name: wordpress-vol
     persistentVolumeClaim:
       claimName: pvc-test
       readOnly: false
```

Create the pod:
```      
kubectl create -f pod-test.yaml
```

Verify pod is created:
```
root@master:~/examples# kubectl get po pod-test
NAME       READY   STATUS    RESTARTS   AGE
pod-test   1/1     Running   0          2m10s
```

## Cleanup

For the dynamic provisioned volume in this example, when the persistent volume claim is deleted, the corresponding Storidge volume will also be deleted. This is because the storage class had `reclaimPolicy: Delete` set.

To delete the persistent volume claim and Storidge volume, first remove the pod, then the persistent volume claim:
```
kubectl delete pod pod-test
kubectl delete pvc pvc-test
```
