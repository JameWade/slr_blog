// Vercel Serverless Function: 51.la 访问统计代理
//
// 为什么需要这个代理：
// 51.la 的 v6-widget.51.la 域名证书曾过期（2026-10-16 前后），
// 浏览器 fetch 会在 TLS 层失败（ERR_CERT_DATE_INVALID），关于页访问统计就只显示“加载失败”。
// 服务端抓取可以忽略过期证书（或走 HTTP 兜底），让前端只和本站同源通信。
import http from 'node:http'
import https from 'node:https'

const WIDGET_ID = '3NzMNsUUPTi406g0'
const WIDGET_HTTPS = `https://v6-widget.51.la/v6/${WIDGET_ID}/quote.js`
const WIDGET_HTTP = `http://v6-widget.51.la/v6/${WIDGET_ID}/quote.js`
const TIMEOUT_MS = 8000

function fetchText(url, { insecure = false } = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const options =
      url.startsWith('https') && insecure
        ? {
            rejectUnauthorized: false, // 只用来取公开统计数据
            headers: { 'User-Agent': 'Mozilla/5.0 (slr-blog widget proxy)', Referer: 'https://blog.zkslr.shop/about/' },
          }
        : { headers: { 'User-Agent': 'Mozilla/5.0 (slr-blog widget proxy)', Referer: 'https://blog.zkslr.shop/about/' } }
    const req = lib.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`upstream ${res.statusCode}`))
        res.resume()
        return
      }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve(body))
    })
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('timeout')))
    req.on('error', reject)
  })
}

// quote.js 里每项形如 <span>序号</span><span>数值</span>，按字符串切分取数值。
// 序号顺序：0 最近活跃访客，1 今日人数，2 今日访问，3 昨日人数，4 昨日访问，5 本月访问，6 总访问量
function parseWidget(text) {
  const parts = text.split('</span><span>')
  const values = []
  for (let i = 1; i < parts.length; i++) {
    const end = parts[i].indexOf('</span></p>')
    if (end === -1) continue
    values.push(parts[i].slice(0, end))
  }
  if (values.length !== 7 || values.some((v) => !/^\d+$/.test(v))) {
    throw new Error('unexpected widget format')
  }
  return values
}

export default async function handler(req, res) {
  try {
    let text
    try {
      text = await fetchText(WIDGET_HTTPS, { insecure: true })
    } catch (e) {
      // https 不可达/证书问题时走 http 兜底（数据是公开的统计文本）
      text = await fetchText(WIDGET_HTTP)
    }
    const values = parseWidget(text)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    // 51.la 会定期重生成 quote.js，边缘缓存 5 分钟即可
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    res.status(200).send(JSON.stringify({ values }))
  } catch (e) {
    res.setHeader('Cache-Control', 'public, s-maxage=60')
    res.status(502).send(JSON.stringify({ error: 'stats unavailable' }))
  }
}
