import os
import re
import xml.etree.ElementTree as ET
from shutil import copyfile

project_root = r'C:\Users\Administrator\.accio\accounts\1754075431\agents\DID-F456DA-2B0D4C\project'
temp_excel = os.path.join(project_root, 'temp_excel')
images_dir = os.path.join(project_root, 'images')

if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# 1. Parse Relationships (Cell Images)
ci_rels_path = os.path.join(temp_excel, 'xl', '_rels', 'cellimages.xml.rels')
ci_rid_to_target = {}
if os.path.exists(ci_rels_path):
    root = ET.parse(ci_rels_path).getroot()
    for rel in root.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
        ci_rid_to_target[rel.get('Id')] = rel.get('Target').replace('media/', '')

# 2. Parse Relationships (Standard Drawings)
dr_rels_path = os.path.join(temp_excel, 'xl', 'drawings', '_rels', 'drawing1.xml.rels')
dr_rid_to_target = {}
if os.path.exists(dr_rels_path):
    root = ET.parse(dr_rels_path).getroot()
    for rel in root.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
        dr_rid_to_target[rel.get('Id')] = rel.get('Target').replace('../media/', '')

# 3. Parse Cell Images Mapping (ID -> Filename)
cellimages_path = os.path.join(temp_excel, 'xl', 'cellimages.xml')
ci_id_to_filename = {}
if os.path.exists(cellimages_path):
    root = ET.parse(cellimages_path).getroot()
    ns = {'etc': 'http://www.wps.cn/officeDocument/2017/etCustomData', 'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
    for ci in root.findall('.//etc:cellImage', ns):
        img_id = ci.find('.//xdr:nvPicPr/xdr:cNvPr', ns).get('name')
        rid = ci.find('.//xdr:blipFill/a:blip', ns).get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
        if rid in ci_rid_to_target:
            ci_id_to_filename[img_id] = ci_rid_to_target[rid]

# 4. Read Shared Strings
shared_strings = []
ss_path = os.path.join(temp_excel, 'xl', 'sharedStrings.xml')
if os.path.exists(ss_path):
    with open(ss_path, 'r', encoding='utf-8') as f:
        ss_content = f.read()
    shared_strings = re.findall(r'<t.*?>(.*?)</t>', ss_content, re.DOTALL)

# 5. Read Sheet1 to get Model Names per Row
sheet_path = os.path.join(temp_excel, 'xl', 'worksheets', 'sheet1.xml')
with open(sheet_path, 'r', encoding='utf-8') as f:
    sheet_xml = f.read()

rows_xml = re.findall(r'<row r="(\d+)"[^>]*>(.*?)</row>', sheet_xml)
row_to_model = {}
row_to_dispimg = {}

for r_num, row_content in rows_xml:
    cells = re.findall(r'<c r="([A-Z]+)\d+"[^>]*?>(.*?)</c>', row_content)
    cell_data = {c[0]: c[1] for c in cells}
    r_idx = int(r_num) - 1 # 0-indexed for comparison with drawing XML
    
    # Model Name usually in Col A
    if 'A' in cell_data:
        v_match = re.search(r'<v>(\d+)</v>', cell_data['A'])
        if v_match:
            idx = int(v_match.group(1))
            if idx < len(shared_strings):
                model_raw = shared_strings[idx].replace('\n', ' ')
                model_id = re.match(r'^([A-Z0-9-]+)', model_raw)
                if model_id:
                    row_to_model[r_idx] = model_id.group(1)
        
    # DISPIMG usually in Col B
    if 'B' in cell_data and 'DISPIMG' in cell_data['B']:
        match = re.search(r'DISPIMG\(&?quot;(ID_[A-Z0-9]+)&?quot;', cell_data['B'])
        if match:
            row_to_dispimg[r_idx] = match.group(1)

# 6. Parse Drawings (Anchored Images)
drawing_path = os.path.join(temp_excel, 'xl', 'drawings', 'drawing1.xml')
row_to_rid = {}
if os.path.exists(drawing_path):
    tree_dr = ET.parse(drawing_path)
    root = tree_dr.getroot()
    ns_dr = {'xdr': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
    
    # Re-parsing with a parent map
    parent_map = {c: p for p in tree_dr.iter() for c in p}
    for pic in tree_dr.findall('.//xdr:pic', ns_dr):
        rid_elem = pic.find('.//a:blip', ns_dr)
        if rid_elem is not None:
            rid = rid_elem.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            # The parent of pic is usually oneCellAnchor or twoCellAnchor
            parent = parent_map[pic]
            from_tag = parent.find('xdr:from', ns_dr)
            if from_tag is not None:
                row_tag = from_tag.find('xdr:row', ns_dr)
                if row_tag is not None:
                    row = int(row_tag.text)
                    row_to_rid[row] = rid

# 7. Final Mapping and Copying
count = 0
for row, model in row_to_model.items():
    img_filename = None
    # Priority 1: DISPIMG
    if row in row_to_dispimg:
        img_id = row_to_dispimg[row]
        img_filename = ci_id_to_filename.get(img_id)
    # Priority 2: Floating Image
    elif row in row_to_rid:
        rid = row_to_rid[row]
        img_filename = dr_rid_to_target.get(rid)
    
    if img_filename:
        src_path = os.path.join(temp_excel, 'xl', 'media', img_filename)
        ext = os.path.splitext(img_filename)[1]
        dst_path = os.path.join(images_dir, f"{model}{ext}")
        if os.path.exists(src_path):
            copyfile(src_path, dst_path)
            count += 1
            print(f"Mapped {model} to {img_filename}")

print(f"Total images extracted: {count}")
