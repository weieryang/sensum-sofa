# Weieryang 网站 SEO 交接

更新日期：2026-10-07（Asia/Shanghai）；历史交接内容按各节日期阅读

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

## 2026-10-06 飘窗垫类目扩展

- 官网保留静态 GitHub Pages 架构。原有 23 个沙发/座椅系列、41 个配置与六个细分类目继续使用原地址；新增独立的飘窗垫方向。产品总目录可筛选“沙发与座椅”或“飘窗垫”。
- 英文类目 `/window-seat-cushions/`，俄文类目 `/ru/window-seat-cushions/`；新增俄文总目录 `/ru/products/`，保留原 `/ru/compressed-sofa/` 入口与页面。
- 新增四个询价系列，每个都有英文和俄文产品页：`teddy-fleece-window-seat-cushion`（WY-WC01）、`corduroy-window-seat-cushion`（WY-WC02）、`cotton-linen-window-seat-cushion`（WY-WC03）、`textured-woven-bay-window-cushion`（WY-WC04）。英文地址为 `/products/<slug>/`，俄文地址为 `/ru/products/<slug>/`。这些是新分配的网页目录编号，不是已确认的工厂型号或 GTIN。
- 图片来自用户提供的飘窗垫素材。主图使用原始参考图，泰迪绒补充场景注明 AI 优化。18 张响应式 WebP 资源共约 1.43 MB；AI 场景不进入 Product 的图片字段。
- 每页具备独立标题/描述、可抓取正文、规格说明、测量方法、问答、询价入口、相关产品内链、canonical、双向 EN/RU/x-default hreflang、社交元数据和与正文对应的结构化数据。新目录使用 CollectionPage/ItemList，新产品使用 Product/BreadcrumbList。
- 商业状态仍是**确认报价后下单**。照片款式无已确认的在线售价、库存、标准尺寸表、面料百分比、泡棉密度、洗护或交期。不能用原沙发数据或通用试算器价格替代其正式报价，不能添加虚构 Offer、评分、评论或可售库存。棉麻名称仅表示外观风格，实际成分待确认。
- 官网首页只替换已有表头飘窗垫入口的目标地址，首页 title/H1、沙发主文案及其他结构保持原样。所有原沙发详情文件保持逐字节一致。未改 DNS、CNAME、robots.txt、旧共享 JS/CSS、GA4 ID 或付款路由。
- 原英文产品总目录的 title、description、H1 和 canonical 保留；新增飘窗垫关键词由独立类目/产品页承接，目录仅增加分组、筛选、卡片、内链及对应列表数据。
- sitemap 保留原 96 个 URL，新增 11 个 URL；仅首页 EN/RU、产品总目录及新页面更新 lastmod。llms.txt 保留原沙发定位，补充飘窗垫准确说明和页面链接；该文件本身不能保证 AI 搜索引用。
- 数据源为 `data/cushions.json`，生成脚本 `scripts/build-cushion-catalog.py`。修改该数据源后运行脚本生成静态页面；它不重新生成旧沙发详情。照片资源位于 `assets/cushions/`。
- 本地发布校验覆盖 613 个内部引用、JSON-LD、互返语言链接、图片资源、生成幂等性、原目录卡片及旧页面保留。线上部署与 IndexNow 回执另存工作区 `cushion-catalog-release/`，应以实际响应核对发布状态。
- 定制预览继续是独立的 noindex 试销页面。产品链接可携带照片款式并清空尺寸，要求买家输入实际尺寸；不跳转到 PayPal Sandbox。正式收款、运费以及官网 `/cushions/` 动态路由仍需单独完成原定支付测试。
- SEO/GEO 是可访问、清晰、可引用的内容和技术基础，不能把页面发布或 IndexNow 接收等同于 Google 收录、自然流量增长或 ChatGPT 引用；后续要用 Search Console 和 GA4 核对旧沙发着陆页及新增飘窗垫流量。

## 2026-10-07 手册驱动的内容与询价优化

- 根据用户手册选择内容集群、询价便利性和准确统计三项落实；未照搬未核实的增长比例，未虚构认证、评价、价格或生产数据。
- 新增英俄双语尺寸指南与面料/选款指南，共四页：`/[ru/]window-seat-cushions/measurement-guide/`、`/[ru/]window-seat-cushions/fabric-design-guide/`。包含原生 SVG 尺寸示意图、单位换算、四款设计对比、洗护/面料确认清单。数据源为 `data/cushion-guides.json`，由现有脚本生成静态正文；类目、产品、指南相互链接。
- 十五个相关页面提供五项询价准备表单：款式、尺寸及单位、数量、目的地、偏好。客户检查后在 email 或 WhatsApp 中自行发送；消息带产品参考码与来源页，可复制文本，JavaScript 不可用时保留直接联系入口。没有新增发送后台或付款承诺。
- `assets/cushion-inquiry.js` 用 textContent 展示输入；编辑字段撤销旧准备结果。待发送 URL 留在页面内存，不写入 href，避免增强型外链点击采集正文 URL；自定义 GA4 不记录尺寸、邮编、备注或正文。
- GA4 ID 不变，新增飘窗垫内容分组、入口/指南/准备询价/联系渠道/定制预览/资料点击事件。原俄语 RFQ 的 `generate_lead` 改为 `inquiry_handoff`；历史事件只是打开沟通工具，不能当成收到询盘。详见 `ANALYTICS_SETUP.md`，该口径变更要在业务报表标注。
- 用户确认 GSC 已验证、Bing 尚未验证；尚未读取实际搜索/统计数据。SEO 基线、60 行 GEO 待测模板、线索台账与外部 UTM 链接草稿位于工作区 `traffic-handbook-optimization/`；不含真实客户数据或假造结果。
- 发布前保护校验覆盖原首页 EN/RU、英文总目录、全部原沙发 HTML、robots、CNAME 和旧布局/导航脚本逐字节不变；本轮只调整共享统计脚本和飘窗垫专用资源。sitemap 保留原 107 个 URL，加四篇指南至 111 个，不修改未更新旧页面的 lastmod。
- 正式付款、运费、商品生产/售后条款、GA4 实际收数、GSC 查询及 Bing 验证仍待完成。发布和 IndexNow 接收不等于流量增长、收录或 AI 引用。回执与检查结果保存在工作区 `traffic-handbook-optimization/`。

## 2026-10-07 选款与移动端询价优化

- 首页 EN/RU 下方已有飘窗垫按钮的 href 从旧预览站改为官网对应类目，保留按钮文字、沙发主文案及页面结构；表头继续进入官网类目。英文总目录仅更新新增飘窗垫卡片的响应式图片 sizes，原沙发卡片不改。
- 十五个相关页面换款时，报价标题、参考图片、图片描述与定制预览同时跟随选择。选择“帮助选款”时隐藏旧款预览；独立预览继续携带款式并清空尺寸，不承接客户表单尺寸或邮编。
- 新增“修改需求”操作：保留已填内容、隐藏旧准备结果、聚焦尺寸框。修改后重新准备消息，避免误发旧内容；仍需客户自行在邮件或 WhatsApp 中发送。没有新增跨页存储、发送后台或正式付款。
- `#quote` 定位到表单面板；输入控件统一 16px。浏览器实测发现旧共享 content-visibility:auto 的估算高度导致手机锚点偏移，现仅对 `.factory-v2.wy-cushion-page main > section` 恢复实际章节布局。旧首页及沙发不匹配这条覆盖。
- 主图、目录卡片、相关款式、照片对比图按各自断点更新 sizes。懒加载图使用 auto 加明确回退尺寸；保留原 srcset、WebP、宽高与延迟加载。没有未经测量的加载速度提升比例。
- 本轮校验：116 个既有页面 SEO 身份保持，98 个原沙发及无关 HTML 逐字节不变，111 个 sitemap 地址完整保留，930 个本地引用通过；55 项表单/统计离线检查通过。浏览器检查十五页的手机及桌面共 30 组布局无横向溢出，并验证英俄换款、回改、重新准备及手机报价定位。
- 本轮专用 CSS/询价 JS 使用版本 `20261007b`，共享统计脚本仍为 `20261007a`。回执在工作区 `cushion-usability-optimization/`。真实流量与收数尚未读取，需通过 GSC/GA4 观察结果，不能保证自然排名没有波动。
