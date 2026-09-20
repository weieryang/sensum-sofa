# Weieryang 网站 SEO 交接

更新日期：2026-09-20（Asia/Shanghai）

## 项目与仓库

- 仓库：https://github.com/weieryang/sensum-sofa
- 线上站点：https://weieryang.com/
- GitHub Pages 从 `main` 分支仓库根目录发布；`CNAME` 指向 `weieryang.com`。
- 当前工作分支：`codex/seo-content-20260821`；交接前最新业务提交：`6753037`（欧盟进口商页面）。发布前应核对远端 `main`，不要盲目覆盖他人的新提交。
- 技术形态：静态 HTML/CSS/JavaScript，无 Next.js 或前端构建步骤。当前主要 SEO 页面可直接被抓取；不要仅为 SEO 而迁移框架。
- 主要位置：英文首页 `index.html`，俄语站 `ru/`，产品与采购页 `products/`、`compressed-sofa/`、`oem-odm/`、`packing/`，采购指南 `blog/`，市场页 `markets/`，公共样式/脚本 `assets/`，`sitemap.xml`、`robots.txt`、`llms.txt`。

## 目标

通过免费自然搜索和 AI 搜索曝光，获取压缩沙发、OEM/ODM、批发与跨境电商相关的 **B2B 有效询盘**。目标客户不限于俄罗斯，也包括美国、欧盟等明确市场的进口商、家具品牌、批发商和电商卖家。优先回答真实采购问题、展示可核实的工厂与产品信息，而不是批量生成仅替换国家名的页面。流量只是中间指标，询盘数量与质量才是最终指标。

## 已完成（截至交接日）

- 英文站已有产品、工厂能力、包装、OEM/ODM、证书/资料、联系页面及采购指南内容集群；`sitemap.xml` 当前列出 96 个 URL，其中俄语路径 14 个、博客路径 29 个、市场路径 3 个（计数包含栏目页）。
- 俄语站已建首页、压缩沙发、OEM/ODM、市场卖家、包装、询盘、产品与采购指南页面，并统一为编辑式视觉风格。
- 建立全球市场入口 `/markets/`，发布美国采购页 `/markets/united-states/` 和欧盟采购页 `/markets/european-union/`，加入产品页内链、sitemap 与 `llms.txt`。
- 修复过部分产品图、指南图和首页图片的裁切/拉伸问题；多语言页面已做视觉统一与站内切换改进。后续新增图片仍需单独检查桌面和手机端完整显示。
- 页面配置了 canonical、部分对应语言的 hreflang、社交分享元数据和相应结构化数据；`robots.txt` 指向 sitemap。具体页面仍需持续核对，不应视为全站永久无误。
- `assets/site-analytics.js` 使用本站独立 GA4 Measurement ID `G-RH7F2SQEQ1`。代码会记录 WhatsApp/邮箱/电话点击、进入联系页点击，以及俄语 RFQ 表单相关事件。**点击或提交事件不等于确认收到有效询盘**。
- 有 `scripts/submit-indexnow.ps1` 可提交更新 URL。2026-09-19 欧盟页、市场入口和压缩沙发页的提交返回 HTTP 202；这只表示服务接收，不代表搜索引擎已收录。
- 最近一次业务发布：`6753037` 已推送到 `main`；当时 GitHub Pages 部署成功，欧盟页面和线上 sitemap 返回 HTTP 200。

## 尚未验证的结果

- 仓库不能证明 Google Search Console 的站点验证、sitemap 处理结果、实际索引状态、关键词排名或自然流量增长；需登录对应账号查看。
- GA4 标签已植入，但尚需在生产站与 GA4 实时报告/DebugView 核对实际收数、事件归因和转化设置。
- 未建立可核对的“自然搜索访问 → 询盘 → 有效客户”基线。不要把已发布页面数或 IndexNow 响应当成获客成果。
- 欧盟/美国法规内容是采购清单，不是产品已获认证或可销售的保证；任何合规、测试或证书说法都应匹配具体型号、材料与目标国家，并以官方最新资料和进口商审核为准。

## 下一步优先级

1. **先建立数据基线。** 核实 Search Console 域名资产、提交并检查 `sitemap.xml`、查看核心页面索引与查询词；核实 GA4 实时访问及事件。每周记录自然搜索点击、展示、着陆页、国家/语言、联系点击和实际收到的有效询盘。
2. **围绕已有需求补内容。** 先看 GSC 查询词、真实客户问题与业务重点，再选一个具体国家或采购痛点做页面。优先补型号参数、材料、包装尺寸/重量、交期、样品与质检证据；避免空泛翻译和地域门页。
3. **改进询盘归因。** 核对英文与俄语联系路径、WhatsApp/邮箱点击是否能对应到具体着陆页和来源；将 `begin_lead` 与真正发送询盘区分，必要时补可验证的提交/收到事件与线索台账。
4. **持续技术巡检。** 新内容发布时检查唯一标题/描述、canonical、适用的 hreflang、JSON-LD、内链、图片完整显示、移动端横向溢出、页面速度、sitemap 与线上 HTTP 状态。仅有明确维护或功能瓶颈时再评估迁移到 Next.js 等架构。

## 发布检查清单

1. 在当前仓库核对 `git status`、远端 `main` 和现有页面，避免覆盖他人修改。
2. 修改页面后同步站内入口/相关内链、`sitemap.xml` 中实际变更 URL 的 `lastmod`，必要时更新 `llms.txt`。
3. 本地检查 HTML、JSON-LD、图片与内部链接，浏览器检查桌面和手机端；法规/标准等易变内容先查官方来源。
4. 提交并推送到仓库 `main`，确认 GitHub Pages 部署成功，再请求线上页面及 sitemap 验证 HTTP 200。
5. 仅对实际新增或更新的 URL 运行 `scripts/submit-indexnow.ps1`；之后在 Search Console/GA4 看结果，不承诺即时收录或排名。

本文件是工作交接快照，不包含 GitHub、GA4 或 Search Console 的登录凭据。
