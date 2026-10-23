export const SITE = {
  website: "https://blog.zkslr.shop",
  author: "zkslr",
  profile: "https://github.com/JameWade",
  desc: "水良人的个人博客，记录区块链、密码学与 AI 的学习笔记",
  title: "应时钓秋水",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/JameWade/slr_blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
  // Custom profile info for homepage hero
  profileHero: {
    // You can change these to your info
    name: "zkslr",
    tagline: "在区块链、密码学与 AI 的世界里做笔记",
    avatar: "/assets/slr.png", // e.g. "/assets/avatar.jpg" (place under public/)
    location: "中国·山东·青岛",
    githubUrl: "https://github.com/jamewade",
    contactText: "关于我，获取联系",
    contactHref: "#about", // or external link to a contact page
    intro:
      "",
  },
  // Multi-paragraph about section on the homepage
  profileAbout: [
    "一名独立开发者，主要从事blockchain和crypto的学习研究工作",
    "这个站点记录我在开发过程中的经验、坑点与思考。",
  ],
} as const;
export const metrics: { enable: boolean; sdk: string; id: string; ck: string; widget: string } = {
  // 51.la 统计开关
  enable: true,
  // 统计网站的配置信息，在后台获取
  // See: https://v6.51.la/report/setup/params/statistics
  sdk: 'https://sdk.51.la/js-sdk-pro.min.js',
  id: '3NzMNsUUPTi406g0',
  ck: '3NzMNsUUPTi406g0',
  // 数据挂件 javascript 地址
  // See: https://v6-widget.51.la/v6/xxxxxxxxxxxxxxxx/quote.js
  widget: 'https://v6-widget.51.la/v6/3NzMNsUUPTi406g0/quote.js'
}
