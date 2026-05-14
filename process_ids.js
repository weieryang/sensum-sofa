const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ids = [
    "11000026179763", "1601758725317", "1601758693200", "1601757727346",
    "1601756568497", "1601756519880", "1601756477651", "1601756434452",
    "1601756431680", "1601754288258", "1601754284336", "1601754259645",
    "1601753978696", "1601748487859", "1601748428810", "1601740966313",
    "1601727797551"
];

const today = new Date().toISOString().split('T')[0];
const outputDir = path.join(process.cwd(), "交付件", today);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate Excel
const data = ids.map(id => ({
    "ID": id,
    "Link": `https://www.alibaba.com/product-detail/_${id}.html`
}));

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, "产品链接");
const excelPath = path.join(outputDir, "产品详情链接.xlsx");
XLSX.writeFile(wb, excelPath);

// Generate HTML
const htmlContent = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>产品链接交互仪表盘</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container {
            max-width: 1000px;
            width: 100%;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .btn-bulk {
            background-color: #ff6a00;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-bulk:hover {
            background-color: #e65f00;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            text-align: left;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        th {
            background-color: #fafafa;
            font-weight: 600;
            color: #666;
        }
        tr:hover {
            background-color: #f9f9f9;
        }
        a {
            color: #007bff;
            text-decoration: none;
            word-break: break-all;
        }
        .status-tag {
            display: none;
            background-color: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-left: 10px;
        }
        /* Visited styles */
        .visited-row {
            background-color: #fff9c4 !important;
        }
        .visited-row a {
            color: #d32f2f !important;
            font-weight: bold;
        }
        .visited-row .status-tag {
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>产品链接交互仪表盘 (${today})</h1>
            <button class="btn-bulk" onclick="bulkOpen()">批量打开所有链接</button>
        </header>
        <table>
            <thead>
                <tr>
                    <th style="width: 200px;">产品 ID</th>
                    <th>详情页链接</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                <tr id="row-${item.ID}">
                    <td>${item.ID}</td>
                    <td>
                        <a href="${item.Link}" target="_blank" onclick="markVisited('row-${item.ID}')">${item.Link}</a>
                        <span class="status-tag">已访问</span>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>

    <script>
        function markVisited(rowId) {
            const row = document.getElementById(rowId);
            if (row) {
                row.classList.add('visited-row');
                localStorage.setItem(rowId, 'visited');
            }
        }

        function bulkOpen() {
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                window.open(link.href, '_blank');
                markVisited(link.parentElement.parentElement.id);
            });
        }

        window.onload = () => {
            document.querySelectorAll('tr[id]').forEach(row => {
                if (localStorage.getItem(row.id) === 'visited') {
                    row.classList.add('visited-row');
                }
            });
        }
    </script>
</body>
</html>`;

const htmlPath = path.join(outputDir, "链接交互仪表盘.html");
fs.writeFileSync(htmlPath, htmlContent);

console.log("SUCCESS: Files saved to " + outputDir);
console.log("Excel: " + excelPath);
console.log("HTML: " + htmlPath);
