import pandas as pd
import sys
import traceback

file_path = r'C:/Users/Administrator/Desktop/图片/主图改图/despo ttakka_塞浦路斯_2026-04-14_询盘聊天记录.xlsx'
output_path = r'C:/Users/Administrator/.accio/accounts/1754075431/agents/DID-F456DA-2B0D4C/project/chat_content.txt'

try:
    print(f"Reading: {file_path}")
    df = pd.read_excel(file_path, engine='openpyxl')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("--- CONTENT ---\n")
        f.write(df.to_string())
        f.write("\n\n--- COLUMNS ---\n")
        f.write(str(df.columns.tolist()))
    
    print(f"Content written to: {output_path}")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
