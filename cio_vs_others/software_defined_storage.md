# Software Defined Storage

As data centers evolved from the fixed three tier model towards a virtualized data center, many storage solutions were implemented as “software defined”. These implementations rely on a system component called a hypervisor. Most software defined storage (SDS) solutions were delivered as virtual storage appliances, i.e. software running in a virtual server. While hypervisors and virtual servers consume system resources, they do provide secure isolation in multi-tenant environments such as the public cloud. 

Within a cloud native environment, hypervisors and virtual servers consume system resources and increases system response time, i.e. adds latency. For efficiency, hypervisors are eliminated particularly on bare metal servers. The increased response time due to running in virtual servers means that software defined storage generally cannot provide performance isolation or quality of service capabilities for applications. 

implemented before need for automation with orchestration was obvious

consistent hash fixking location

not well positioned to leverage low latency tech like nvme

Most current SDS software vendors target the virtualized server and ESX hypervisor market. The products were developed for an era where the primary management interface in the data center was a human operated GUI. While software driven interfaces can be tacked on, architecturally they are not a good fit for the real time provisioning, agility, scalability and operating efficiencies of container based applications. 


In secure environments, hypervisors are eliminated for efficiency. Another drawback is hypervisors and virtual servers increase system response time so much that performance isolation is not possible for applications. 
Storidge is designed to use system resources effectively and provide the performance isolation that cloud native apps need to scale efficiently. 




