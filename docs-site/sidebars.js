// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guideSidebar: [
    {
      type: 'category',
      label: 'Layout',
      collapsed: false,
      items: [
        'layout-story',
        'layout-reference',
      ],
    },
    {
      type: 'category',
      label: 'Website Builder',
      collapsed: false,
      items: [
        'website-builder',
        'website-builder-in-the-app',
      ],
    },
  ],
};

export default sidebars;
