import os
import re
import json
import xml.etree.ElementTree as ET

project_root = r'C:\Users\Administrator\.accio\accounts\1754075431\agents\DID-F456DA-2B0D4C\project'
temp_excel = os.path.join(project_root, 'temp_excel')
output_json = os.path.join(project_root, 'products.json')
images_dir = os.path.join(project_root, 'images')

existing_images = os.listdir(images_dir) if os.path.exists(images_dir) else []

# 1. Parse Shared Strings
shared_strings = []
ss_path = os.path.join(temp_excel, 'xl', 'sharedStrings.xml')
if os.path.exists(ss_path):
    tree = ET.parse(ss_path)
    root = tree.getroot()
    # Use namespace
    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    for si in root.findall('ns:si', ns):
        t_elem = si.find('ns:t', ns)
        if t_elem is not None:
            shared_strings.append(t_elem.text if t_elem.text else "")
        else:
            # Handle phonetic runs or other structures if any
            shared_strings.append("".join(si.itertext()))

# 2. Parse Sheet1
sheet_path = os.path.join(temp_excel, 'xl', 'worksheets', 'sheet1.xml')
tree_sheet = ET.parse(sheet_path)
root_sheet = tree_sheet.getroot()
ns_sheet = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def get_cell_val(cell, shared_strings):
    v = cell.find('ns:v', ns_sheet)
    if v is None: return ""
    val = v.text
    if cell.get('t') == 's':
        idx = int(val)
        return shared_strings[idx] if idx < len(shared_strings) else ""
    return val

products = []
for row in root_sheet.findall('.//ns:row', ns_sheet):
    r_num = int(row.get('r'))
    if r_num < 6: continue
    
    cell_map = {}
    for cell in row.findall('ns:c', ns_sheet):
        ref = cell.get('r')
        # Extract column letter
        col = re.match(r'([A-Z]+)', ref).group(1)
        cell_map[col] = cell

    model_raw = get_cell_val(cell_map.get('A'), shared_strings)
    if not model_raw or not model_raw.startswith('FN'): continue
    
    model_id = model_raw.split('\n')[0].strip()
    name_cn = get_cell_val(cell_map.get('C'), shared_strings).replace('\n', ' ').strip()
    
    category = "single"
    if "床" in name_cn or "Sofa Bed" in model_raw: category = "sofabed"
    elif "模块" in name_cn or "组合" in name_cn: category = "modular"

    try:
        p1_rmb = float(get_cell_val(cell_map.get('D'), shared_strings) or 0)
        p1_usd = float(get_cell_val(cell_map.get('E'), shared_strings) or 0)
        p2_rmb = float(get_cell_val(cell_map.get('F'), shared_strings) or 0)
        p2_usd = float(get_cell_val(cell_map.get('G'), shared_strings) or 0)
        p3_rmb = float(get_cell_val(cell_map.get('H'), shared_strings) or 0)
        p3_usd = float(get_cell_val(cell_map.get('I'), shared_strings) or 0)
    except:
        p1_rmb = p1_usd = p2_rmb = p2_usd = p3_rmb = p3_usd = 0
    
    size = get_cell_val(cell_map.get('J'), shared_strings).replace('\n', ' ')
    weight = float(get_cell_val(cell_map.get('L'), shared_strings) or 0)
    packing = get_cell_val(cell_map.get('M'), shared_strings).replace('\n', ' ')
    try:
        loading = int(get_cell_val(cell_map.get('N'), shared_strings) or 0)
    except:
        loading = 0
    
    # Match image
    image_path = ""
    for ext in ['.png', '.jpeg', '.jpg']:
        if f"{model_id}{ext}" in existing_images:
            image_path = f"images/{model_id}{ext}"
            break

    products.append({
        "model": model_id,
        "category": category,
        "name_en": model_id,
        "name_cn": name_cn or model_id,
        "size": size,
        "packing_size": packing,
        "loading_40hq": loading,
        "weight": weight,
        "price_rmb": [p1_rmb, p2_rmb, p3_rmb],
        "price_usd": [round(p1_usd, 2), round(p2_usd, 2), round(p3_usd, 2)],
        "image": image_path,
        "tags": ["Hot"] if loading > 500 else []
    })

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print(f"Generated {len(products)} products.")
