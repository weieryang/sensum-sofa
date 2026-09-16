# Weieryang 网站统计配置

站点已经预埋统一的 GA4 加载器，但在填写真实 Measurement ID 之前不会连接 Google，也不会发送统计数据。

## 1. 启用 Google Analytics 4

1. 登录 Google Analytics，创建账号和 GA4 媒体资源。
2. 在“管理”中打开“数据流”，新建 Web 数据流。
3. 网站网址填写 `https://weieryang.com`，数据流名称建议填写 `Weieryang Website`。
4. 复制以 `G-` 开头的 Measurement ID。
5. 打开 `assets/site-analytics.js`，把 `GA4_MEASUREMENT_ID = ""` 改成真实 ID，例如 `GA4_MEASUREMENT_ID = "G-ABC123DE45"`。
6. 不要再把 Google 提供的整段 `gtag.js` 代码粘贴到 HTML，否则可能产生重复统计。
7. 提交并推送到 `main`，等待 GitHub Pages 部署完成。
8. 用无痕窗口访问网站，在 GA4“实时”报告中确认访问和事件。

已经配置的事件：

- `contact_click`：点击 WhatsApp、Email 或电话。
- `begin_lead`：进入询价页。
- `lead_form_start`：开始填写俄语 RFQ。
- `generate_lead`：通过俄语 RFQ 打开 WhatsApp 或 Email。
- `select_content`：点击产品页或俄语指南。

脚本不会把表单姓名、公司、地址、数量或询价正文发送给 GA4。广告存储、广告个性化和 Google Signals 默认关闭。

## 2. 配置 Google Search Console

1. 登录 Google Search Console，添加“网域”资源 `weieryang.com`。
2. 按 Google 提示，在域名 DNS 管理后台添加专属 TXT 记录。这种方式可以覆盖 HTTP、HTTPS 和所有子域名。
3. 验证成功后，提交站点地图 `https://weieryang.com/sitemap.xml`。
4. 用“网址检查”分别检查首页、俄语首页、指南中心和两篇俄语指南，并对尚未收录的页面请求编入索引。
5. 不要删除 DNS 验证记录，Google 会定期重新验证所有权。

如果无法修改 DNS，可以在 Search Console 添加“网址前缀”资源，下载 Google 提供的专属 HTML 验证文件，然后把文件原样放到仓库根目录。不要修改文件名或内容。

## 3. 发布后的检查

1. 确认 GA4 实时报告能看到自己的访问。
2. 点击一次 WhatsApp、Email 和询价入口，确认对应事件出现。
3. 在 GA4 管理后台把 `generate_lead` 标记为关键事件。
4. 过滤公司内部访问流量，避免自己的测试污染数据。
5. 若面向需要用户同意后才能统计的地区，应在正式启用 GA4 前补充隐私政策和同意管理界面。
