# Weieryang Compressed Sofa Catalog Website

这是压缩沙发在线产品目录的静态网站源码，可直接上传到 GitHub 仓库并用 GitHub Pages 发布。

## 文件说明

- `index.html`：网站首页 / 产品目录页
- `certificates.html`：独立证书与检测报告页面
- `assets/fabric-color-card.pdf`：面料色板 PDF
- `assets/certificates/`：证书与检测报告 PDF
- `assets/cert_previews/`：证书预览图

## GitHub Pages 上传方式

1. 新建一个 GitHub 仓库。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 进入仓库 `Settings` → `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，Folder 选择 `/root`。
6. 保存后等待 GitHub 生成网站链接。

## 注意

请保持 `index.html`、`certificates.html` 和 `assets` 文件夹在同一级目录，否则 PDF、证书页和下载按钮会找不到文件。
