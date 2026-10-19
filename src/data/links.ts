// 友链数据（2026-10-19 整理自 LINUX DO 友链交换帖 https://linux.do/t/topic/2814627）
export interface FriendLink {
  name: string;
  url: string;
  intro: string;
  avatar?: string;
}

export const FRIEND_LINKS: FriendLink[] = [
  {
    name: "喻灵",
    url: "https://blog.yvling.cn",
    intro: "网络安全工程师、AI-Native 开发者",
    avatar: "https://yvling-picbed.oss-cn-hangzhou.aliyuncs.com/notes/1787731248128.jpg",
  },
  {
    name: "WenyBlog",
    url: "https://blog.voosol.com/",
    intro: "Flight of thoughts, light of code（思绪远航，代码生光）",
    avatar: "https://blog.voosol.com/favicon-old.png",
  },
  {
    name: "Disco的博客",
    url: "https://www.weasley.cn/",
    intro: "Dance Dance Dance",
    avatar: "https://www.weasley.cn/favicon.png",
  },
  {
    name: "CutieCat's Blog",
    url: "https://z6.ci/",
    intro: "Οι σημειώσεις μάθησης μιας χαριτωμένης γάτας.",
    avatar: "https://z6.ci/wp-content/uploads/2026/08/1787531004-cutiecat.png",
  },
  {
    name: "传火祭祀场",
    url: "https://ryuki.icu",
    intro: "无名，成不了薪，且被诅咒的不死人",
    avatar: "https://ryuki.icu/favicon/favicon-512.png",
  },
  {
    name: "尼采般地抒情",
    url: "https://wztlink1013.com/",
    intro: "生活、AI、技术",
    avatar: "https://wztlink1013.com/brand/avatar.webp",
  },
  {
    name: "Zhiim's Blog",
    url: "https://xland.cc",
    intro: "总有想不明白的事",
    avatar: "https://xland.cc/img/avatar.jpg",
  },
  {
    name: "符辞 · fu.ci",
    url: "https://fu.ci",
    intro: "如果你需要，我可以帮你生成一个更稳、更一针见血的博客介绍",
    avatar: "https://fu.ci/brand/seal-logo.png",
  },
  {
    name: "coderZoe 的博客",
    url: "https://coderzoe.com",
    intro: "学如逆水行舟，不进则退",
  },
  {
    name: "橘猫小窝",
    url: "https://jumaomaomaoju.cn",
    intro: "一个慢更的小窝，记录后端开发、AI 工具和自己折腾的小项目。写给未来的自己，也欢迎路过的你来串门。",
    avatar: "https://jumaomaomaoju.cn/images/cat-avatar.png",
  },
  {
    name: "上玄APEX",
    url: "https://sxapex.com",
    intro: "我们正在经历AGI",
    avatar: "https://avatars.githubusercontent.com/u/153280338?v=4&s=160",
  },
  {
    name: "当下的七炎",
    url: "https://raclen.qzz.io",
    intro: "记录技术、工具、投资与日常思考。",
    avatar: "https://avatars.githubusercontent.com/u/7697758?v=4&s=80",
  },
  {
    name: "Pasule Blog",
    url: "https://pasule.com",
    intro: "Keep the Wonder. Keep the Fire",
    avatar: "https://tu.pasule.com/file/wallpaper/1784014500478.png",
  },
];
