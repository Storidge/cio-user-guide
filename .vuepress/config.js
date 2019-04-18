// /.vuepress/config.js

module.exports = {
    title: '',
    description: "CIO User Guide",
    themeConfig: {
        logo: 'https://storidge.com/wp-content/uploads/2019/04/logo_storidge_automated_2_370x100.png',
        lastUpdated: 'Last Updated',
        editLink: true,
        editLinkText: 'Help us improve this page!',
        sidebarDepth: 3,
        nav: [
            { text: 'Home', link: 'https://storidge.com', },
            { text: 'Docs', link: 'https://storidge.com/docs' },
            { text: 'API', link: 'https://storidge.com/api' },
            { text: 'GitHub', link: 'https://github.com/storidge' }
        ],
        sidebar: [
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
              '/getting_started/profiles.md',
              '/getting_started/labels.md',
              '/getting_started/teardown.md'
            ]
          }
        ]
    }
}
