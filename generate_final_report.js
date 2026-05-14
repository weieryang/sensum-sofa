const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } = require('docx');

// Load Data
const sgData = JSON.parse(fs.readFileSync('research/singapore_importers.json', 'utf8'));
const myData = JSON.parse(fs.readFileSync('research/malaysia_importers.json', 'utf8'));
const thData = JSON.parse(fs.readFileSync('research/thailand_importers.json', 'utf8'));
const mmData = JSON.parse(fs.readFileSync('research/myanmar_importers.json', 'utf8'));

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

function createBuyerTable(index, data) {
    const dm = data.decision_makers?.[0] || data.Decision_Makers?.[0] || {};
    const contactInfo = `姓名: ${dm.name || "N/A"}\n职位: ${dm.title || "采购负责人"}\n邮箱: ${dm.professional_email || dm.email || "N/A"}\n电话: ${dm.professional_phone || dm.phone || "N/A"}\n领英: ${dm.linkedin_url || dm.linkedin || "N/A"}`;

    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: `${index}. ${data.name || data.Name} -- [${data.category || data.Category}]`,
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
            new TableRow({ children: [createCell("官方网址", true), createCell(data.website || data.Website)] }),
            new TableRow({ children: [createCell("公司概况", true), createCell(data.business_profile || data.profile || data["Business Profile"])] }),
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
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({ text: "📊 进口采购分析", bold: true, size: 20, color: "C65911" }),
                                new TextRun({ text: ` | 目标HS: 761510/760719. 采购频率: 稳定进口. 主要来源: 中国、日本、泰国.`, size: 20 })
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
            new Paragraph({ style: "Title", children: [new TextRun("新马泰缅铝箔餐盒及卷材精准买家决策人名录")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HS: 7615109090 / 7607190000  |  涵盖 4 国核心进口商及决策人一手联系方式", size: 22, color: "545454", italics: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、🇸🇬 新加坡核心买家 (Top 25)")] }),
            ...sgData.slice(0, 25).map((d, i) => [createBuyerTable(i + 1, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、🇲🇾 马来西亚核心买家 (Top 25)")] }),
            ...myData.slice(0, 25).map((d, i) => [createBuyerTable(i + 26, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、🇹🇭 泰国核心买家 (Top 25)")] }),
            ...thData.slice(0, 25).map((d, i) => [createBuyerTable(i + 51, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、🇲🇲 缅甸核心买家 (Top 25)")] }),
            ...mmData.slice(0, 25).map((d, i) => [createBuyerTable(i + 76, d), new Paragraph({ children: [new TextRun("")] })]).flat()
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("新马泰缅铝箔产品精准买家决策人名录_美化版.docx", buffer);
    console.log("Word file generated successfully.");
});
