/**
 * remark-mermaid
 * 把 ```mermaid 代码块转成 <pre class="mermaid"> 原生 HTML，
 * 跳过 Shiki 高亮，交给客户端的 mermaid.js 渲染。
 * 无第三方依赖。
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function walk(node: any): void {
  const children = node?.children;
  if (!Array.isArray(children)) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child?.type === "code" && child?.lang === "mermaid") {
      children[i] = {
        type: "html",
        value: `<pre class="mermaid">${escapeHtml(child.value ?? "")}</pre>`,
      };
    } else {
      walk(child);
    }
  }
}

export function remarkMermaid() {
  return (tree: any) => {
    walk(tree);
  };
}

export default remarkMermaid;
