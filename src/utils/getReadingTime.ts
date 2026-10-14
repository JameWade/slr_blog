/** 估算文章阅读时长（分钟）
 * 中文按 400 字/分钟，英文按 200 词/分钟，向上取整，至少 1 分钟
 */
export function getReadingTime(text: string): number {
  if (!text) return 1;
  const cjkChars =
    text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\uff00-\uffef]/g)?.length ?? 0;
  const words = text.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const minutes = cjkChars / 400 + words / 200;
  return Math.max(1, Math.round(minutes));
}
