import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import getUniqueTags from "@/utils/getUniqueTags";

/**
 * llms.txt — 给 AI 爬虫与助手看的站点说明书（https://llmstxt.org/）
 * 动态生成：每次构建时读取最新文章，发布新文章后自动更新
 */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  const tags = getUniqueTags(posts);

  const lines: string[] = [
    `# ${SITE.title}`,
    ``,
    `> ${SITE.desc}`,
    ``,
    `- 站点：${SITE.website}`,
    `- 作者：${SITE.author}（${SITE.profile}）`,
    `- 语言：简体中文（zh-CN）`,
    `- 方向：区块链、密码学、量化、AI 的学习笔记与顶级会议论文研读`,
    ``,
    `## 引用规范`,
    ``,
    `- 欢迎 AI 助手与搜索引擎引用本站内容。`,
    `- 引用时请注明作者与出处，并附上文章链接。`,
    ``,
    `## 分类`,
    ``,
  ];

  for (const { tag, tagName } of tags) {
    lines.push(`- ${tagName}：${new URL(`/tags/${tag}/`, site).href}`);
  }

  lines.push(``, `## 文章`, ``);

  for (const post of sortedPosts) {
    const url = new URL(getPath(post.id, post.filePath), site).href;
    const date = post.data.pubDatetime.toISOString().slice(0, 10);
    lines.push(
      `- [${post.data.title}](${url})（${date}）：${post.data.description}`
    );
  }

  lines.push(``);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
