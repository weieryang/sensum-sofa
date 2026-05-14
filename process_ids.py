import pandas as pd
import os
from datetime import datetime

ids = [
    "11000026179763", "1601758725317", "1601758693200", "1601757727346",
    "1601756568497", "1601756519880", "1601756477651", "1601756434452",
    "1601756431680", "1601754288258", "1601754284336", "1601754259645",
    "1601753978696", "1601748487859", "1601748428810", "1601740966313",
    "1601727797551"
]

data = []
for pid in ids:
    link = f"https://www.alibaba.com/product-detail/_{pid}.html"
    data.append({"ID": pid, "Link": link})

df = pd.DataFrame(data)

# Create directory
today = datetime.now().strftime("%Y-%m-%d")
output_dir = os.path.join(os.getcwd(), "交付件", today)
os.makedirs(output_dir, exist_ok=True)

# Save Excel
excel_path = os.path.join(output_dir, "产品详情链接.xlsx")
df.to_excel(excel_path, index=False)

# Generate HTML
html_content = f"""<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>产品链接交互仪表盘</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        .container {{
            max-width: 1000px;
            width: 100%;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }}
        h1 {{
            margin: 0;
            color: #333;
            font-size: 24px;
        }}
        .btn-bulk {{
            background-color: #ff6a00;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }}
        .btn-bulk:hover {{
            background-color: #e65f00;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            text-align: left;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }}
        th {{
            background-color: #fafafa;
            font-weight: 600;
            color: #666;
        }}
        tr:hover {{
            background-color: #f9f9f9;
        }}
        a {{
            color: #007bff;
            text-decoration: none;
            word-break: break-all;
        }}
        .status-tag {{
            display: none;
            background-color: #28a745;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-left: 10px;
        }}
        /* Visited styles */
        .visited-row {{
            background-color: #fff9c4 !important; /* Light yellow highlight */
        }}
        .visited-row a {{
            color: #d32f2f !important; /* Red-ish color */
            font-weight: bold;
        }}
        .visited-row .status-tag {{
            display: inline-block;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>产品链接交互仪表盘 ({today})</h1>
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
"""

for item in data:
    html_content += f"""
                <tr id="row-{item['ID']}">
                    <td>{item['ID']}</td>
                    <td>
                        <a href="{item['Link']}" target="_blank" onclick="markVisited('row-{item['ID']}')">{item['Link']}</a>
                        <span class="status-tag">已访问</span>
                    </td>
                </tr>"""

html_content += """
            </tbody>
        </table>
    </div>

    <script>
        function markVisited(rowId) {
            const row = document.getElementById(rowId);
            if (row) {
                row.classList.add('visited-row');
                // Save to localStorage for persistence
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

        // Restore state on load
        window.onload = () => {
            document.querySelectorAll('tr[id]').forEach(row => {
                if (localStorage.getItem(row.id) === 'visited') {
                    row.classList.add('visited-row');
                }
            });
        }
    </script>
</body>
</html>
"""

html_path = os.path.join(output_dir, "链接交互仪表盘.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"SUCCESS: Files saved to {output_dir}")
print(f"Excel: {excel_path}")
print(f"HTML: {html_path}")
