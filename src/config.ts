export const SITE = {
  website: "https://astro-paper.pages.dev/", // replace this with your deployed domain
  author: "zkslr",
  profile: "https://satnaing.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "水良人的BLOG",
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
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // Custom profile info for homepage hero
  profileHero: {
    // You can change these to your info
    name: "zkslr",
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
