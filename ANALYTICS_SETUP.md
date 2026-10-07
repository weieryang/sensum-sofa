# Weieryang 网站统计与自然流量复盘

更新：2026-10-07（Asia/Shanghai）。本文记录代码状态和需要核实的后台设置，不代表已验证实际收数或流量增长。

## 已有配置

- 官网使用一个 GA4 加载器 `assets/site-analytics.js`，Measurement ID 为 `G-RH7F2SQEQ1`。不要重复粘贴 gtag 或再安装另一份 GTM 标签。
- 用户已确认 Google Search Console 验证完成；尚未读取其查询、着陆页、索引或历史数据。Bing Webmaster 尚未验证。
- `sitemap.xml` 包含 111 个 URL，原 107 个地址全部保留。新增四篇英俄指南，位于 `/[ru/]window-seat-cushions/measurement-guide/` 与 `/[ru/]window-seat-cushions/fabric-design-guide/`。
- 官网保留静态 HTML；飘窗垫正文、内链与表单说明在原始 HTML 中可读。无 JavaScript 时保留直接邮件/WhatsApp 询价入口。
- 广告存储、广告个性化与 Google Signals 仍关闭；既有 analytics_storage 默认 granted 未改变。本轮未添加 Clarity、广告像素或新的第三方统计脚本。

## 事件的准确含义

| 事件 | 触发条件 | 可以说明什么 |
| --- | --- | --- |
| `cushion_entry_click` | 从其他官网页面进入飘窗垫类目或产品 | 现有流量对新品入口的兴趣 |
| `select_content` | 点击产品、类目或指南 | 内容点击，非成交 |
| `begin_lead` | 点击联系页或飘窗垫报价锚点 | 询价意向 |
| `lead_form_start` | 首次聚焦俄语 RFQ 或飘窗垫表单 | 开始填写 |
| `cushion_inquiry_ready` | 五项表单校验后生成可检查的消息 | 需求已整理，尚未发送 |
| `contact_click` | 电话/邮件/WhatsApp 点击或准备好的询价选择联系渠道 | 尝试联系 |
| `inquiry_handoff` | 已准备的飘窗垫询价打开邮件/WhatsApp，或原俄语 RFQ 打开对应工具 | 转交沟通工具，不能证明已发送或收到 |
| `customization_open` | 点击独立定制预览站 | 打开预览，非付款 |
| `resource_download_click` | 点击本站 PDF、Office、CSV 或 ZIP 资源 | 下载入口点击，非下载完成 |

**口径变更：** 从本次脚本发布起，原俄语 RFQ 的邮件/WhatsApp 操作由 `generate_lead` 改为 `inquiry_handoff`。旧 `generate_lead` 历史记录也只是打开沟通工具，不能按有效询盘解读。部署交界期旧缓存脚本可能继续发送旧事件；在报表注明变更日期，不要据此判断询盘突然下降。

当前没有后台自动确认收到询盘的接口，前端不发送 `generate_lead`、成交或收入事件。实际收到、有效、报价和成交数量应在销售线索台账中记录；未来有可靠提交接口或 CRM 回传时再增加对应事件。

自定义事件仅含语言、内容分组、来源路径、固定产品参考码和联系渠道等信息。尺寸、邮编、数量、备注、完整询价正文及带正文的联系 URL 不进入这些事件。表单不存储个人信息到 URL 或本地存储；准备好的发送地址保存在页面内存，发送控件使用按钮，避免自动外链点击采集正文 URL。换页后需要重新填写。

## 在后台验证，不用代码状态代替结果

1. 用生产站打开 GA4 实时报告或 DebugView，分别检查英俄类目、指南、产品分组以及上表事件。localhost 不加载 GA4。
2. 从飘窗垫入口进入产品页，填写测试需求并准备消息；确认只有意向/准备事件，没有“收到询盘”或成交事件。选择联系渠道只会打开沟通工具，仍需人工发送。
3. 核对旧 `generate_lead` 是否被标为关键事件，报表不要继续把它当成有效询盘。若把 `inquiry_handoff` 标为意向关键事件，请明确标注其定义；有效询盘单独统计。
4. 检查 GA4 增强型衡量的表单和下载开关。自动 `form_submit` 与自定义 `cushion_inquiry_ready`、自动 `file_download` 与 `resource_download_click` 属于不同口径，不能相加当成两条线索。
5. 排除内部测试访问，核对访问来源与目标市场。现有 GA4 后台权限、实时收数、关键事件配置和过滤规则尚未在本轮验证。

## GSC、Bing 与内容优化

- 在已验证的 GSC 资源检查 `https://weieryang.com/sitemap.xml`，查看新指南的 URL 检查结果。只对重要新增或实质更新页面请求抓取；请求不等于收录。
- 导出最近 28 天与前 28 天的查询、着陆页、国家和设备数据。把原沙发页面作为独立观察组，再比较飘窗垫的新访问和意向；不要因新品零基线干扰原站判断。
- 有真实数据后，再筛选有展示、平均排名约 8–20 的页面，逐页判断搜索意图和内链。不要仅凭手册通用阈值批量改旧标题、URL 或首页主文案。
- Bing 可在本人后台使用 GSC 导入验证；否则使用 Bing 提供的准确验证记录。仓库不放猜测的验证码。验证后提交同一 sitemap，检查处理与索引结果。
- IndexNow 已有公开验证密钥，只提交真实新增或更新 URL。HTTP 202 表示已接收且密钥验证待处理；任何接收状态均不保证收录或 AI 引用。
- 当前 robots.txt 通配允许抓取，未新增阻断。robots 允许不等于 CDN 一定放行，需结合真实爬虫访问/防火墙日志判断，不能根据自定义 User-Agent 的一次 HTTP 请求认定全网可抓取。

## 固定复盘口径

工作区 `traffic-handbook-optimization/` 提供可填写的 CSV：

- `seo-baseline.csv`：原沙发与新增飘窗垫分组，记录日期范围、GSC 点击/展示/CTR/排名、GA4 自然访问、沟通工具打开数和实际有效询盘数。空值代表待测，不代表零。
- `geo-monitoring.csv`：固定 20 个买家问题，分别在 ChatGPT、Perplexity、Gemini 记录答案。品牌提及和网址引用分列；记录日期、语言、搜索开关、模式、引用 URL 和证据。60 行为待测模板，不是已取得的引用结果。
- `lead-log.csv`：人工登记收到询盘、来源页、产品、有效性、回复和报价/成交状态。该模板不包含客户数据；填写后应保存在私有位置，不上传公开仓库。
- `campaign-links.csv`：外部邮件签名、WhatsApp、LinkedIn、目录等使用的 UTM 链接草稿。不要把这些 UTM 加到本站内部链接。没有代发邮件、社媒内容或投放广告。

按同一日期范围和定义复盘自然访问、沟通工具打开、实际询盘、有效询盘与成交。手册中的增长百分比和时间预期未核实，不作为本项目承诺。没有创建定时任务。

## 官方参考

- Google 的 AI 搜索同样依赖基础 SEO、可索引正文和内链，无专用 AI 标记或新文本文件要求：https://developers.google.com/search/docs/appearance/ai-features
- GA4 `generate_lead` 定义：https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead
- OpenAI 的 OAI-SearchBot 用于搜索，GPTBot 用于可能的训练，两个控制独立：https://developers.openai.com/api/docs/bots
- IndexNow 响应定义：https://www.indexnow.org/documentation
