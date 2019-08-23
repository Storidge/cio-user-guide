// /.vuepress/config.js

module.exports = {
    title: '', // Title of the website
    description: "A quick walkthrough of CIO capabilities",
    themeConfig: {
//        logo: 'https://storidge.com/wp-content/uploads/2019/04/logo_storidge_automated_2_370x100.png',
        lastUpdated: 'Last Updated',
        editLink: true,
        editLinkText: 'Help us improve this page!',
        sidebarDepth: 3,
        nav: [
            { text: 'Home', link: 'https://storidge.com', },
            { text: 'Docs', link: 'https://docs.storidge.com' },
            { text: 'FAQ', link: 'https://faq.storidge.com' },
            { text: 'API', link: 'https://storidge.com/api' },
            { text: 'Support', link: 'https://storidge.com/support' }
        ],
        sidebar: [
          ['/', 'Guide Home'],
        {
            title: 'What is CIO?',
            collapsable: true,
            children: [
              '/what_is_cio/introduction.md'
            ]
          },
          {
            title: 'CIO vs Others',
            collapsable: true,
            children: [
              '/cio_vs_others/overview.md',
              '/cio_vs_others/enterprise_storage_systems.md',
              '/cio_vs_others/software_defined_storage.md',
              '/cio_vs_others/cloud_native_storage.md'
            ]
          },
          {
            title: 'Getting Started',
            collapsable: true,
            children: [
              '/getting_started/install.md',
              '/getting_started/initialize.md',
              '/getting_started/volumes.md',
              '/getting_started/docker_volumes.md',
              '/getting_started/docker_stack_volumes.md',
              '/getting_started/why_profiles.md',
              '/getting_started/using_profiles.md',
              '/getting_started/snapshots.md',
              '/getting_started/autoexpand.md',
              '/getting_started/high_availability.md',
              '/getting_started/labels.md',
              '/getting_started/node_maintenance.md',
              '/getting_started/remove_node.md',
              '/getting_started/add_node.md',
              '/getting_started/teardown.md'
            ]
          }
        ]
    }
}
