import pandas as pd
import json
import os

excel_path = r'C:\Users\Administrator\xwechat_files\wxid_waarpat1open42_db3a\msg\file\2026-05\20260506压缩沙发价格表(1).xlsx'
df = pd.read_excel(excel_path, sheet_name='沙发', skiprows=4)

# Filter out empty rows or headers
df = df[df['model\n型号'].notna()]

# Image mapping (manual list from ls output)
images = {
    'FN-001A': 'images/FN-001A.jpeg',
    'FN-002': 'images/FN-002.jpeg',
    'FN-008A': 'images/FN-008A.jpeg',
    'FN-009A': 'images/FN-009A.png',
    'FN-010': 'images/FN-010.png',
    'FN-010A': 'images/FN-010A.png',
    'FN-010B': 'images/FN-010B.png',
    'FN-010C': 'images/FN-010C.png',
    'FN-011': 'images/FN-011.png',
    'FN-011A': 'images/FN-011A.jpeg',
    'FN-011B': 'images/FN-011B.png',
    'FN-011C': 'images/FN-011C.jpeg',
    'FN-011D': 'images/FN-011D.jpeg',
    'FN-013': 'images/FN-013.png',
    'FN-101A': 'images/FN-101A.png',
    'FN-104': 'images/FN-104.png',
    'FN-105A': 'images/FN-105A.png',
    'FN-201B': 'images/FN-201B.png',
    'FN-201C': 'images/FN-201C.png',
    'FN-202A': 'images/FN-202A.png',
    'FN-204': 'images/FN-204.png',
    'FN-204A': 'images/FN-204A.png',
    'FN-204C': 'images/FN-204C.png',
    'FN-301A': 'images/FN-301A.jpeg',
    'FN-302E': 'images/FN-302E.png',
    'FN-304C': 'images/FN-304C.png',
    'FN-305D': 'images/FN-305D.jpeg',
    'FN-308A': 'images/FN-308A.jpeg',
    'FN-311F': 'images/FN-311F.png',
    'FN-801': 'images/FN-801.png',
    'FN-802': 'images/FN-802.png',
    'FN-804': 'images/FN-804.png',
    'FN-805': 'images/FN-805.png'
}

product_list = []
for _, row in df.iterrows():
    model_raw = str(row['model\n型号']).split('\n')[0].strip()
    if not model_raw.startswith('FN'): continue
    
    # Prices (handle NaN)
    p1 = row.iloc[6] if not pd.isna(row.iloc[6]) else 0
    p2 = row.iloc[7] if not pd.isna(row.iloc[7]) else 0
    p3 = row.iloc[8] if not pd.isna(row.iloc[8]) else 0
    
    # Convert RMB to USD (approx 6.8 as per previous logic or calculate)
    # Actually row index 17 and 18 are RMB/USD labels? No.
    # Let's just use the columns.
    
    product = {
        'model': model_raw,
        'category': 'sofa', # Default
        'name_en': model_raw, # Default
        'name_cn': str(row['model\n型号']).split('\n')[-1].strip(),
        'size': str(row.iloc[5]).strip(),
        'packing_size': str(row.iloc[9]).strip(),
        'loading_40hq': int(row.iloc[13]) if not pd.isna(row.iloc[13]) else 0,
        'weight': float(row.iloc[11]) if not pd.isna(row.iloc[11]) else 0,
        'price_rmb': [float(p1), float(p2), float(p3)],
        'price_usd': [round(float(p1)/6.8, 2), round(float(p2)/6.8, 2), round(float(p3)/6.8, 2)],
        'image': images.get(model_raw, ''),
        'tags': []
    }
    product_list.append(product)

print(json.dumps(product_list, indent=4, ensure_ascii=False))
