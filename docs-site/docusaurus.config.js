// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Educo',
  tagline: 'Build your school website. Run your school.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://educo.app',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Inter from Google Fonts
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // docs/guide/ is the SINGLE SOURCE — Docusaurus renders it; never copies it.
          path: '../docs/guide',
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/whaaala/educo/edit/master/',
          // README.md is an internal engineering index; it is not part of the user-facing site.
          exclude: ['README.md'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
        disableSwitch: false,
      },
      navbar: {
        title: 'Educo',
        hideOnScroll: false,
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'guideSidebar',
            position: 'left',
            label: 'Guide',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `© ${new Date().getFullYear()} Educo`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
    }),
};

export default config;
