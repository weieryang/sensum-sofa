const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');

const fontName = "微软雅黑";
const blueColor = "1F497D";
const grayColor = "F7F7F7";
const whiteColor = "FFFFFF";

function createLeadTable(data) {
    const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
    const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

    const labels = [
        "公司名称", "网站地址", "品牌画像", "批发/合作意向", "决策人姓名", "职位", "领英链接", "个人办公邮箱", "产品开发钩子"
    ];

    const values = [
        data.company, data.website, data.profile, data.intent, data.person, data.position, data.linkedin, data.email, data.hook
    ];

    const rows = labels.map((label, i) => {
        const isAlternate = i % 2 === 1;
        const rowBg = isAlternate ? grayColor : whiteColor;

        return new TableRow({
            children: [
                new TableCell({
                    width: { size: 2500, type: WidthType.DXA },
                    shading: { fill: blueColor, type: ShadingType.CLEAR },
                    borders: cellBorders,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                        children: [new TextRun({ text: label, color: whiteColor, bold: true, font: fontName, size: 22 })]
                    })]
                }),
                new TableCell({
                    width: { size: 6860, type: WidthType.DXA },
                    shading: { fill: rowBg, type: ShadingType.CLEAR },
                    borders: cellBorders,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                        children: [new TextRun({ text: values[i] || "N/A", font: fontName, size: 22 })]
                    })]
                })
            ]
        });
    });

    return new Table({
        columnWidths: [2500, 6860],
        rows: rows,
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
}

const leads = [
    {
        company: "Swyft Home",
        website: "https://swyfthome.com",
        profile: "英国豪华“沙发盒子”品牌，主打24小时配送及无工具组装专利。",
        intent: "拥有成熟的Trade/Wholesale渠道，对供应链响应速度要求极高。",
        person: "Keiran Hewkin",
        position: "Founder & CEO",
        linkedin: "https://uk.linkedin.com/in/keiran-hewkin-341b3753",
        email: "keiran.hewkin@swyfthome.com",
        hook: "针对其“Swyft-lok”专利需求，提供更高性价比的模块化框架及环保海绵配套，助力其提升欧洲市场利润率。"
    },
    {
        company: "Snug",
        website: "https://snugsofa.com",
        profile: "英国模块化沙发先驱，专注于小空间/窄走廊配送方案。",
        intent: "品牌已被收购，正处于渠道扩张期，对稳定的OEM/ODM合作伙伴有长期需求。",
        person: "Robert Bridgman",
        position: "Founder",
        linkedin: "https://uk.linkedin.com/in/robertbridgman",
        email: "rob@snugsofa.com",
        hook: "提供针对窄小空间优化的新型压缩沙发结构，支持低MOQ定制面料，匹配其快速迭代的产品策略。"
    },
    {
        company: "Noah Living",
        website: "https://noah-living.com",
        profile: "德国柏林独立设计品牌，推崇极简主义与模块化“无限增长”概念。",
        intent: "核心受众为环保意识强的年轻中产，重视可持续材料与FSC认证。",
        person: "Dario Muscas",
        position: "Co-Founder",
        linkedin: "https://de.linkedin.com/in/dariomuscas",
        email: "dario@noah-living.com",
        hook: "我司具备FSC/OEKO-TEX双重认证，可提供全拆装、高耐用度的压缩沙发方案，完美契合其可持续品牌基因。"
    },
    {
        company: "Tediber",
        website: "https://www.tediber.com",
        profile: "法国领先的DTC睡眠品牌，已从床垫成功跨界至高品质沙发床领域。",
        intent: "追求极致的法式简约设计与快速交付体验，正在寻找高端制造伙伴。",
        person: "Julien Sylvain",
        position: "Founder & CEO",
        linkedin: "https://fr.linkedin.com/in/juliensylvain",
        email: "julien@tediber.com",
        hook: "针对法国市场对“设计感+舒适度”的双重追求，推荐我司意式极简压缩系列，实现体积压缩与质感不妥协。"
    },
    {
        company: "Bruno (Brunobett)",
        website: "https://www.brunobett.de",
        profile: "德国高端家具品牌，以德式工匠精神和精细化模块设计著称。",
        intent: "对供应商的品质管控和物流保护有严苛标准，倾向于中高端代工合作。",
        person: "Felix Baer",
        position: "Founder",
        linkedin: "https://de.linkedin.com/in/felixbaer",
        email: "felix@brunobett.de",
        hook: "提供通过德标测试的高密度回弹海绵方案，结合优化的压缩包装技术，确保产品在长途运输后完美恢复原形。"
    }
];

const sections = leads.map(lead => {
    return {
        children: [
            new Paragraph({
                heading: "Heading 1",
                children: [new TextRun({ text: `客户开发调研：${lead.company}`, font: fontName, bold: true, color: blueColor })]
            }),
            createLeadTable(lead),
            new Paragraph({ children: [new TextRun({ text: "" })] }) // Spacer
        ]
    };
});

const doc = new Document({
    styles: {
        paragraphStyles: [
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 32, bold: true, font: fontName, color: blueColor },
                paragraph: { spacing: { before: 240, after: 120 } }
            }
        ]
    },
    sections: sections
});

Packer.toBuffer(doc).then(buffer => {
    const outputPath = "C:\\Users\\Administrator\\Desktop\\Accio Work-finish\\欧洲压缩沙发开发\\2026-05-20\\欧洲压缩沙发潜客调研报告_NumberOne.docx";
    const backupPath = "C:\\Users\\Administrator\\Desktop\\欧洲压缩沙发潜客调研报告_NumberOne.docx";
    fs.writeFileSync(outputPath, buffer);
    fs.writeFileSync(backupPath, buffer);
    console.log("Success: Report generated at " + outputPath);
});
