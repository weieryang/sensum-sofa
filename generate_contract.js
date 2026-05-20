const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Arial",
                    size: 24, // 12pt
                },
            },
        },
        paragraphStyles: [
            {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                run: { size: 48, bold: true, color: "000000" },
                paragraph: { spacing: { before: 240, after: 480 }, alignment: AlignmentType.CENTER }
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { size: 32, bold: true, color: "000000" },
                paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 }
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
        },
        children: [
            new Paragraph({
                style: "Title",
                children: [new TextRun("房屋租赁合同（住宅类标准模板）")]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "出租方（甲方）：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "证件号码：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "联系电话：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({ children: [] }), // Empty line
            new Paragraph({
                children: [
                    new TextRun({ text: "承租方（乙方）：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "证件号码：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "联系电话：", bold: true }),
                    new TextRun(" __________________________")
                ]
            }),
            new Paragraph({ children: [] }), // Empty line
            new Paragraph({
                children: [
                    new TextRun("根据《中华人民共和国民法典》及相关法律法规，甲、乙双方在平等、自愿的基础上，就房屋租赁事宜达成如下协议：")
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第一条 房屋基本情况")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 甲方将位于 __________________________________________________ 的房屋出租给乙方使用。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 该房屋用途为："),
                    new TextRun({ text: "住宅", bold: true }),
                    new TextRun("。乙方保证租赁期间不擅自改变用途。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第二条 租赁期限")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 租赁期共 _____ 个月，自 _____ 年 _____ 月 _____ 日起至 _____ 年 _____ 月 _____ 日止。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 租赁期满，甲方有权收回房屋，乙方应如期交还。乙方如需续租，应在租赁期满前 _____ 日书面通知甲方，经甲方同意后重新签订合同。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第三条 租金及支付方式")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 租金为每月人民币（大写） ____________________ 元（￥ __________ ）。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 支付方式：__________（如：押一付三 / 按月支付）。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("3. 支付时间：乙方应于每期租金到期前 _____ 日内向甲方指定账户支付下一期租金。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第四条 押金")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 为保证合同履行，乙方应在签订本合同时向甲方缴纳押金人民币（大写） ____________________ 元（￥ __________ ）。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 租赁期满，乙方结清相关费用并完好交还房屋后，甲方应将押金全额（不计利息）退还乙方。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第五条 相关费用承担")]
            }),
            new Paragraph({
                children: [
                    new TextRun("租赁期间，以下费用由乙方承担：")
                ]
            }),
            new Paragraph({
                children: [new TextRun("• 水、电、燃气费")]
            }),
            new Paragraph({
                children: [new TextRun("• 物业管理费")]
            }),
            new Paragraph({
                children: [new TextRun("• 宽带、有线电视费")]
            }),
            new Paragraph({
                children: [new TextRun("• 其他因乙方使用产生的费用：__________")]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第六条 房屋维护与维修")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 甲方应保证房屋结构安全及设施（如电器、家具等）能正常使用。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 乙方应爱护房屋及设施，因乙方使用不当导致损坏的，由乙方负责维修或赔偿。")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun("3. 未经甲方书面同意，乙方不得擅自对房屋进行装修或拆改。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第七条 合同解除与违约责任")]
            }),
            new Paragraph({
                children: [
                    new TextRun("1. 乙方有下列情形之一的，甲方有权解除合同并没收押金：")
                ]
            }),
            new Paragraph({
                children: [new TextRun("    • 擅自将房屋转租、分租或转让的；")]
            }),
            new Paragraph({
                children: [new TextRun("    • 利用承租房屋进行非法活动的；")]
            }),
            new Paragraph({
                children: [new TextRun("    • 拖欠租金超过 _____ 日的。")]
            }),
            new Paragraph({
                children: [
                    new TextRun("2. 甲方无正当理由提前收回房屋的，应双倍返还押金或按 __________ 标准赔偿乙方。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第八条 争议解决")]
            }),
            new Paragraph({
                children: [
                    new TextRun("本合同在履行中发生争议，由甲、乙双方协商解决；协商不成的，可依法向房屋所在地人民法院起诉。")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第九条 其他约定")]
            }),
            new Paragraph({
                children: [
                    new TextRun("_________________________________________________________________")
                ]
            }),

            new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("第十条 签署")]
            }),
            new Paragraph({
                children: [
                    new TextRun("本合同一式两份，甲、乙双方各执一份，自双方签字/盖章之日起生效。")
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({
                children: [
                    new TextRun({ text: "甲方（签章）：", bold: true }),
                    new TextRun(" _______________ "),
                    new TextRun({ text: "乙方（签章）：", bold: true }),
                    new TextRun(" _______________ ")
                ]
            }),
            new Paragraph({
                children: [
                    new TextRun({ text: "日期：", bold: true }),
                    new TextRun(" _____年____月____日 "),
                    new TextRun({ text: "      日期：", bold: true }),
                    new TextRun(" _____年____月____日 ")
                ]
            })
        ]
    }]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("房屋租赁合同模板.docx", buffer);
});
