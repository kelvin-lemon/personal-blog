module.exports = {
  title: "VuePress template",
  description:
    "A JAMstack website template with the default VuePress theme and Netlify CMS config.",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "产品介绍", link: "/guide/"},
      {
        text: "GitHub",
        link: "https://github.com/kelvin-lemon/personal-blog",
      },
    ]
  },
  plugins: [
      [
        require('./plugins/auto-sidebar/index.js'),
        {
          sort: {
            mode: 'custom',
            fn: (a, b)=> {
              if (a.frontmatter.sort && b.frontmatter.sort) {
                return a.frontmatter.sort > b.frontmatter.sort ? -1 : 1
              }
              return 1
            }
          }
        }
      ]
  ]
};
