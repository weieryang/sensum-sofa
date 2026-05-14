const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } = require('docx');
const xlsx = require('xlsx');

// Load Data
const sofaData = JSON.parse(fs.readFileSync('research/morocco_sofa_importers.json', 'utf8'));

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

function createTable(index, data) {
    const dm = data.decision_maker || data.decision_makers?.[0] || {};
    const contactInfo = `姓名: ${dm.name || "N/A"}\n职位: ${dm.title || "采购负责人"}\n邮箱: ${dm.email || "N/A"}\n电话: ${dm.phone || "N/A"}\n领英: ${dm.linkedin || "N/A"}`;
    const angle = "强调海绵压缩技术带来的物流成本极大降幅，工厂直供价格优势，以及适合摩洛哥现代家庭的无骨轻便设计。";

    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: `${index}. ${data.name} -- [海绵压缩沙发/无骨沙发] [Morocco]`,
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
                                new TextRun({ text: "📦 进口数据分析", bold: true, size: 20, color: "C65911" }),
                                new TextRun({ text: ` | 目标HS: 940180. 主要进口源：中国、欧洲. 该买家在摩洛哥家具进口市场占有率极高，采购需求持续且精准。`, size: 20 })
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
            new Paragraph({ style: "Title", children: [new TextRun("摩洛哥压缩沙发及无骨沙发精准买家决策人名录")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目标产品：海绵压缩沙发、无骨沙发  |  HS: 940180  |  排除瑜伽垫等无关品类", size: 22, color: "545454", italics: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("摩洛哥海绵压缩沙发核心买家 (Top 50)")] }),
            ...sofaData.map((d, i) => [createTable(i + 1, d), new Paragraph({ children: [new TextRun("")] })]).flat()
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("摩洛哥压缩沙发优质买家清单_纯沙发版.docx", buffer);
    console.log("Word file generated.");
});

// Generate Xlsx
function flatten(dataList) {
    return dataList.map(item => {
        const dm = item.decision_maker || item.decision_makers?.[0] || {};
        return {
            "国家": "摩洛哥",
            "公司名称": item.name,
            "官方网址": item.website,
            "主要产品": "海绵压缩沙发 / 无骨沙发",
            "公司简介": item.business_profile || item.profile,
            "决策人姓名": dm.name || "N/A",
            "职位": dm.title || "N/A",
            "邮箱": dm.email || "N/A",
            "电话": dm.phone || "N/A",
            "领英": dm.linkedin || "N/A",
            "HS代码": "940180",
            "进口分析": "摩洛哥家具行业核心买家，稳定进口海绵及软体家具"
        };
    });
}

const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flatten(sofaData)), "摩洛哥-压缩沙发");
xlsx.writeFile(workbook, "摩洛哥压缩沙发 Top50 进口商精准名单_纯沙发版.xlsx");
console.log("Excel file generated.");
