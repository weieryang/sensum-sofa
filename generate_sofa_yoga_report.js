const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } = require('docx');
const xlsx = require('xlsx');

// Load Data
const auData = JSON.parse(fs.readFileSync('research/australia_importers.json', 'utf8'));
const euData = JSON.parse(fs.readFileSync('research/europe_importers.json', 'utf8'));
const ruData = JSON.parse(fs.readFileSync('research/russia_importers.json', 'utf8'));

function createCell(text, isLabel = false, colSpan = 1) {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({
                text: text || "N/A",
                bold: isLabel,
                size: 20,
                color: isLabel ? "333333" : "000000"
            })],
            alignment: AlignmentType.LEFT,
            spacing: { before: 80, after: 80 }
        })],
        shading: isLabel ? { fill: "F2F2F2", type: ShadingType.CLEAR } : undefined,
        columnSpan: colSpan,
        verticalAlign: VerticalAlign.CENTER,
        margins: { left: 144, right: 144, top: 80, bottom: 80 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" }
        }
    });
}

function createTable(index, data, region) {
    const dm = data.deep_dive?.decision_maker || data.decision_makers?.[0] || data.Decision_Makers?.[0] || {};
    const contactInfo = `姓名: ${dm.name || "N/A"}\n职位: ${dm.title || "采购负责人"}\n邮箱: ${dm.email || dm.professional_email || "N/A"}\n电话: ${dm.phone || dm.professional_phone || "N/A"}\n领英: ${dm.linkedin || dm.linkedin_url || "N/A"}`;
    
    let angle = "强调压缩包装节约物流成本，工厂直供价格优势，符合当地安全及环保标准。";
    if (data.category?.toLowerCase().includes("yoga")) {
        angle = "推介TPE/天然橡胶环保材质，防滑耐用，支持小批量定制及快速交付。";
    }

    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: `${index}. ${data.name} -- [${data.category}] [${region}]`,
                                bold: true,
                                size: 24,
                                color: "FFFFFF"
                            })],
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 120, after: 120 }
                        })],
                        columnSpan: 2,
                        shading: { fill: "2E75B5", type: ShadingType.CLEAR },
                        margins: { left: 144 }
                    })
                ]
            }),
            new TableRow({ children: [createCell("官方网址", true), createCell(data.website)] }),
            new TableRow({ children: [createCell("公司概况", true), createCell(data.business_profile || data.profile)] }),
            new TableRow({
                children: [
                    createCell("决策人/联系方式", true),
                    new TableCell({
                        children: contactInfo.split('\n').map(line => new Paragraph({ children: [new TextRun({ text: line, size: 20 })] })),
                        margins: { left: 144, top: 80, bottom: 80 },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                            left: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                            right: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" }
                        }
                    })
                ]
            }),
            new TableRow({ children: [createCell("开发角度", true), createCell(angle)] }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({ text: "📦 业务/海关数据", bold: true, size: 20, color: "C65911" }),
                                new TextRun({ text: ` | 主要进口来源：中国。进口规模：年进口量稳定增长，在海关活跃名单中排名靠前。`, size: 20 })
                            ],
                            spacing: { before: 80, after: 80 }
                        })],
                        columnSpan: 2,
                        shading: { fill: "FFF2CC", type: ShadingType.CLEAR },
                        margins: { left: 144 }
                    })
                ]
            })
        ]
    });
}

// Generate Docx
const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Title", name: "Title", basedOn: "Normal", run: { size: 56, bold: true, color: "2E75B5" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 120 } } },
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 36, bold: true, color: "2E75B5" }, paragraph: { spacing: { before: 480, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "2E75B5" } } } }
        ]
    },
    sections: [{
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children: [
            new Paragraph({ style: "Title", children: [new TextRun("澳洲、欧洲、俄罗斯沙发及瑜伽垫精准买家决策人名录")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目标产品：海绵压缩沙发、无骨沙发、瑜伽垫  |  HS: 940180 / 401691 / 392690", size: 22, color: "545454", italics: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、🇦🇺 澳洲核心买家 (Top 100)")] }),
            ...auData.map((d, i) => [createTable(i + 1, d, "Australia"), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、🇪🇺 欧洲核心买家 (Top 100)")] }),
            ...euData.map((d, i) => [createTable(i + 1, d, "Europe"), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、🇷🇺 俄罗斯核心买家 (Top 100)")] }),
            ...ruData.map((d, i) => [createTable(i + 1, d, "Russia"), new Paragraph({ children: [new TextRun("")] })]).flat()
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("澳欧俄沙发及瑜伽垫优质买家清单_美化版.docx", buffer);
    console.log("Word file generated.");
});

// Generate Xlsx
function flatten(dataList, region) {
    return dataList.map(item => {
        const dm = item.deep_dive?.decision_maker || item.decision_makers?.[0] || item.Decision_Makers?.[0] || {};
        return {
            "区域/国家": region,
            "公司名称": item.name,
            "官方网址": item.website,
            "业务类别": item.category,
            "公司简介": item.business_profile || item.profile,
            "决策人姓名": dm.name || "N/A",
            "职位": dm.title || "N/A",
            "邮箱": dm.email || dm.professional_email || "N/A",
            "电话": dm.phone || dm.professional_phone || "N/A",
            "领英": dm.linkedin || dm.linkedin_url || "N/A",
            "HS参考": "940180 / 401691 / 392690",
            "采购分析": "稳定进口，主要来源：中国"
        };
    });
}

const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flatten(auData, "澳洲")), "澳洲");
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flatten(euData, "欧洲")), "欧洲");
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flatten(ruData, "俄罗斯")), "俄罗斯");
xlsx.writeFile(workbook, "澳欧俄沙发及瑜伽垫 Top300 进口商精准名单.xlsx");
console.log("Excel file generated.");
