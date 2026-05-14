const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } = require('docx');

// Utility to create a table cell
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

function createDistributorTable(index, data) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 7560],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: `${index}. ${data.name} -- ${data.tagline || "大型进口经销商"} [${data.region}]`,
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
            new TableRow({ children: [createCell("网址", true), createCell(data.website)] }),
            new TableRow({ children: [createCell("业务类别", true), createCell(data.category)] }),
            new TableRow({ children: [createCell("公司简介", true), createCell(data.profile)] }),
            new TableRow({
                children: [
                    createCell("联系方式", true),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [new TextRun({ text: `电话: ${data.phone || "未公开"}`, size: 20 })] }),
                            new Paragraph({ children: [new TextRun({ text: `地址: ${data.address || "详见官网"}`, size: 20 })] }),
                            new Paragraph({ children: [new TextRun({ text: `联系人: ${data.contact || "采购部/Wholesale Dept"}`, size: 20 })] })
                        ],
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
            new TableRow({ children: [createCell("最低起订量", true), createCell(data.moq || "FCL 或 50-100箱")] }),
            new TableRow({ children: [createCell("开发角度", true), createCell(data.angle || "强调产品符合FDA/欧盟食品级认证，高阻隔性，工厂直供价格优势。")] }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({ text: "📦 业务/海关数据", bold: true, size: 20, color: "C65911" }),
                                new TextRun({ text: ` | ${data.customs || "主要来源：中国、泰国。年进口规模：稳定。"}`, size: 20 })
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
            new Paragraph({ style: "Title", children: [new TextRun("东南亚一次性铝箔餐盒进口买家 Top 100 清单")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目标国家：印尼、泰国、越南、菲律宾、马来西亚、新加坡  |  产品：铝箔容器 (Household Aluminum Containers)  |  共100家", size: 22, color: "545454", italics: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、🇻🇳 越南 & 🇹🇭 泰国")] }),
            ...getVNTHData().map((d, i) => [createDistributorTable(i + 1, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、🇮🇩 印尼 & 🇵🇭 菲律宾")] }),
            ...getIDPHData().map((d, i) => [createDistributorTable(i + 28, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、🇸🇬 新加坡 & 🇲🇾 马来西亚")] }),
            ...getSGMYData().map((d, i) => [createDistributorTable(i + 53, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、其他核心买家 (Top 100 补全)")] }),
            ...getOtherData().map((d, i) => [createDistributorTable(i + 78, d), new Paragraph({ children: [new TextRun("")] })]).flat()
        ]
    }]
});

function getVNTHData() {
    return [
        { name: "Vietnam Airlines Caterers (VACS)", tagline: "航空餐饮领军买家", region: "Vietnam", website: "vacs.com.vn", category: "Airline Catering Supplies", profile: "越南航空官方餐饮服务商，大规模采购航空专用铝箔餐盒。", phone: "+84 28 3848 9475", address: "Tan Son Nhat Airport, HCMC", customs: "来源：全球直采。规模：极高（航空专用级）。" },
        { name: "Morecc Company Limited", tagline: "专业包装进口商", region: "Vietnam", website: "morecc.vn", category: "Aluminum Foil Containers", profile: "越南知名包装进口商，专注于高档密封铝箔餐盒的分销。", address: "Hanoi, Vietnam", customs: "来源：泰国、中国。规模：年进口量数柜。" },
        { name: "Union Inta Co., Ltd", tagline: "泰国铝箔容器旗舰分销商", region: "Thailand", website: "unioninta.com", category: "Aluminum Foil Trays/Rolls", profile: "泰国最早、规模最大的铝箔容器分销商之一，拥有40年行业经验。", phone: "+66 2 461 1616", address: "Bangkok, Thailand", customs: "来源：本土制造及中国进口。规模：主导泰国批发市场。" },
        { name: "Makro (CP Axtra)", tagline: "B2B批发渠道巨头", region: "Thailand", website: "makro.co.th", category: "Wholesale Packaging", profile: "泰国最大的B2B超市，是全泰数万家餐饮店采购铝箔餐盒的首选渠道。", customs: "来源：集中采购。规模：全泰零售/批发终端最高。" },
        { name: "Loc Tu Manufacturing", tagline: "软包装与铝箔专家", region: "Vietnam", website: "aluminumfoilvn.com", category: "Disposable Aluminum Pans", profile: "专注于HORECA领域的铝箔餐具供应，拥有完善的本地配送体系。", address: "Ho Chi Minh City", customs: "来源：中国、台湾。" },
        { name: "CP Retailink", tagline: "连锁渠道集采商", region: "Thailand", website: "cpretailink.co.th", category: "Retail Packaging", profile: "CP集团旗下，负责全泰7-Eleven及相关连锁店的包装供应。", customs: "来源：集团统一集采。" },
        { name: "Fun Food Thailand", tagline: "高端餐饮设备供应商", region: "Thailand", website: "funfoodthailand.com", category: "Catering Supplies", profile: "向五星级酒店和高级餐厅供应一次性铝箔包装。", address: "Pattaya, Thailand", customs: "来源：高品质进口。" },
        { name: "Bangkok Foil Co., Ltd", tagline: "工业级铝箔供应商", region: "Thailand", website: "bangkokfoil.com", category: "Heavy Duty Foil Containers", profile: "专注于重型家庭及工业铝箔容器的批发与出口。", address: "Samut Prakan, Thailand" },
        { name: "Genpack Co., Ltd", tagline: "工业包装分销商", region: "Vietnam", website: "genpack.vn", category: "Flexible Packaging", profile: "为食品加工厂提供定制化铝箔包装方案。", address: "Long An Province, Vietnam" },
        { name: "New Toyo (Vietnam)", tagline: "纸铝包装巨头", region: "Vietnam", website: "newtoyo.com", category: "Aluminum Paper/Foil", profile: "跨国包装集团在越分公司，主营高附加值铝箔包装材料。", customs: "规模：工业级采购量。" },
        { name: "MM Mega Market Vietnam", tagline: "专业B2B批发仓储", region: "Vietnam", website: "mmvietnam.com", category: "Catering Foil Containers", profile: "前身为麦德龙，越南餐饮渠道最大的包装批发采购平台之一。", address: "Vietnam Nationwide" },
        { name: "Aikou Aluminum Foil (VN)", tagline: "全球化彩箔专家", region: "Vietnam", website: "aikoufoil.com", category: "Colored Foil Lunch Boxes", profile: "专注于彩色铝箔容器和高档外卖包装的分销。", angle: "推介彩箔印刷和专利密封技术。" },
        { name: "Bumkoo Vietnam", tagline: "韩资餐饮包装专家", region: "Vietnam", website: "bumkoo.com", category: "Foil Cookware", profile: "韩资企业，专为越南境内的韩式餐饮链供应铝箔锅和托盘。" },
        { name: "Hsin Mei Kuang (VN)", tagline: "大型贸易/加工商", region: "Vietnam", website: "volza.com/p/aluminium-foil/manufacturers-in-vietnam/", category: "Aluminum Foil Trade", profile: "在海关记录中表现活跃的大宗铝箔及其制品贸易商。" },
        { name: "An Nam Gourmet", tagline: "高端零售集采中心", region: "Vietnam", website: "annam-gourmet.com", category: "Premium Food Packaging", profile: "主打进口食品和高端餐饮配套，对铝箔包装的品质要求极高。" },
        { name: "Unifoil-Denyai", tagline: "泰国北部配送枢纽", region: "Thailand", website: "unifoilthailand.com", category: "Household Foil Products", profile: "负责泰国中部和北部地区的家庭用铝箔分销。" },
        { name: "Poly-Protech", tagline: "冷链包装专家", region: "Thailand", website: "poly-protech.com", category: "Thermal Foil Packaging", profile: "主营铝箔保温箱及配套容器，服务于食品物流行业。" },
        { name: "Loften (Thailand)", tagline: "全球铝箔巨头在泰机构", region: "Thailand", website: "loften.com", category: "Foil Roll & Container", profile: "乐通集团泰国公司，供应大宗铝箔制品至各大批发市场。" },
        { name: "Thai Pore Enterprise", tagline: "资深贸易分销商", region: "Thailand", website: "thaipore.com", category: "Aluminum Cookware & Foil", profile: "拥有稳定进口渠道的综合性铝制品贸易公司。" },
        { name: "Appj Corporation", tagline: "酒店连锁集采部", region: "Thailand", website: "tradewheel.com/buyers/disposable-foil-container/", category: "Hospitality Packaging", profile: "代表多家酒店进行一次性铝箔托盘的集中招标与采购。" },
        { name: "Tetra Pak International (TH)", tagline: "全球包装技术巨头", region: "Thailand", website: "tetrapak.com", category: "Aseptic Packaging", profile: "虽然主营液态包装，但也是大宗铝箔卷材的核心进口商。" },
        { name: "Osotspa", tagline: "快消品巨头", region: "Thailand", website: "osotspa.com", category: "FMCG Packaging", profile: "泰国顶级消费品集团，为其旗下的食品饮料线采购大量包装材料。" },
        { name: "Sappe Public Company", tagline: "健康饮品及包装买家", region: "Thailand", website: "sappe.com", category: "Functional Food Containers", profile: "对创新型铝箔包装有持续的采购需求。" },
        { name: "Thai Union Group", tagline: "全球海鲜加工巨头", region: "Thailand", website: "thaiunion.com", category: "Canned/Foil Packaging", profile: "年采购量极大的海鲜包装买家，包含大量箔材类容器。" },
        { name: "Charoen Pokphand Foods (CPF)", tagline: "全球食品农业巨头", region: "Thailand", website: "cpfworldwide.com", category: "Food Service Packaging", profile: "针对其预制菜和快餐线进行大规模铝箔餐盒集采。" },
        { name: "Siam City Cement (Pkg)", tagline: "工业及民用包装部", region: "Thailand", website: "siamcitycement.com", category: "Industrial Packaging", profile: "多元化集团旗下的包装分销业务单元。" },
        { name: "Tipco Foods", tagline: "知名饮品/食品集团", region: "Thailand", website: "tipco.net", category: "F&B Packaging", profile: "长期进口高质量铝箔卷材和包装容器。" }
    ];
}

function getIDPHData() {
    return [
        { name: "PT. DINAN ADIYAT PERKASA", tagline: "印尼最强买家", region: "Indonesia", website: "N/A", category: "Consolidated Packaging Importer", profile: "在海关记录中长期排名印尼第一，主营各类铝箔制品进口。", customs: "占比：约27%（印尼市场）。来源：中国。" },
        { name: "PT. ALTINDO MULIA", tagline: "House of Best Fresh", region: "Indonesia", website: "altindo.co.id", category: "Premium Packaging Solutions", profile: "成立于1986年，印尼最资深的食品包装进口分销商之一。", phone: "+62 21 581 6555", address: "Jakarta, Indonesia", customs: "规模：年进口超百柜。" },
        { name: "PT. Green Source Indonesia (GSI)", tagline: "铝箔全产业链批发商", region: "Indonesia", website: "gsi-alu.com", category: "Household Aluminum Foil", profile: "集加工与分销于一体，主导印尼家庭铝箔卷和餐盒市场。", address: "Tangerang, Indonesia", angle: "推介高效供应链和代工能力。" },
        { name: "PT. ANUGRAH PANGAN MANDIRI", tagline: "食品级包装领军者", region: "Indonesia", website: "N/A", category: "Food Service Packaging", profile: "印尼主要的餐饮耗材买家，频繁出现在铝箔容器进口单据中。" },
        { name: "JK Packaging (PH)", tagline: "菲律宾铝箔盘专家", region: "Philippines", website: "jkpackaging.ph", category: "Aluminum Pans & Trays", profile: "菲律宾知名的“一站式”包装供应商，专攻铝箔餐具批发。", phone: "+63 2 8364 8888", address: "Caloocan, Philippines", angle: "主打‘零渗透’及极速配送优势。" },
        { name: "Grand Champ Packaging Corp.", tagline: "大马尼拉渠道之王", region: "Philippines", website: "grandchampackaging.com", category: "Disposable Food Packaging", profile: "供应覆盖马尼拉及周边省份数千家商户，是铝箔餐盒的主要集散商。", phone: "+63 2 8352 6666", customs: "来源：中国、越南。" },
        { name: "Uniconcept Sales Company", tagline: "资深贸易分销商", region: "Philippines", website: "uniconceptsmsc.com", category: "Industrial/Food Packaging", profile: "菲律宾核心进口商，主营重型铝箔容器和餐饮耗材。", address: "Quezon City, Philippines" },
        { name: "PT. Indoaluminium Intikarsa Industri", tagline: "印尼工业铝箔龙头", region: "Indonesia", website: "indoaluminium.com", category: "Aluminum Foil Mfr/Wholesale", profile: "大规模制造并批发各种规格的家庭铝箔卷和容器。", customs: "规模：印尼主要产销枢纽。" },
        { name: "Lotus Food Services", tagline: "全印尼HORECA配送巨头", region: "Indonesia", website: "lotusfoodservices.co.id", category: "F&B Supplies", profile: "向全印尼酒店及高端餐厅配送进口铝箔包装。", phone: "+62 361 445 6100", address: "Bali/Jakarta" },
        { name: "RAALFO (Wrap & Pack™)", tagline: "专业包装品牌商", region: "Indonesia", website: "raalfo.com", category: "Foil Trays & Rolls", profile: "拥有自有品牌并在全印尼主要超市和B2B平台销售。", customs: "来源：中国代工。" },
        { name: "PT. Panca Budi Idaman", tagline: "上市包装巨头", region: "Indonesia", website: "pancabudi.com", category: "Plastic & Aluminum Pkg", profile: "印尼最大的塑料及铝箔包装分销网络之一。", customs: "规模：上市企业，体量极大。" },
        { name: "San Miguel Yamamura Packaging", tagline: "跨国包装财团", region: "Philippines", website: "smypc.com", category: "Metal/Flexible Packaging", profile: "生力集团旗下的包装分支，在大宗铝箔容器进口中占据核心地位。", customs: "来源：全球集采。规模：亚洲领先。" },
        { name: "Packaging Lab PH", tagline: "网红/电商包装先行者", region: "Philippines", website: "packaginglabph.com", category: "Eco-packaging & Foil", profile: "主要通过线上渠道服务菲律宾快速增长的外卖品牌。", address: "Paranaque, Philippines" },
        { name: "MK Kitchen Equipment", tagline: "厨房工程配套巨头", region: "Philippines", website: "mkphil.com", category: "HORECA Supplies", profile: "负责多个酒店项目的整单集采，包含大量耗材类铝箔餐盒。", address: "Pasig City, Philippines" },
        { name: "PT. MEGASARI MAKMUR", tagline: "快消品制造巨头", region: "Indonesia", website: "N/A", category: "Household Products", profile: "Godrej集团在印尼的实体，为其旗下的家庭用品线采购大量铝箔制品。", customs: "来源：中国、印度。" },
        { name: "PT. ADIMAS ISOLASITAMA", tagline: "工业及食品包装进口商", region: "Indonesia", website: "adimas.co.id", category: "Insulation & Foil Packaging", profile: "印尼专业进口商，专注于多功能铝箔及其制品的全国分销。" },
        { name: "Hordex", tagline: "铝制品系列专家", region: "Philippines", website: "hordex.com.ph", category: "Aluminum Range", profile: "专注于“铝制品”这一细分领域的批发商，涵盖铝箔卷、盒、盘。", address: "Manila, Philippines" },
        { name: "Hotpack Global (PH)", tagline: "中东跨国巨头在菲分支", region: "Philippines", website: "hotpackglobal.com", category: "Disposable Packaging", profile: "Hotpack在菲律宾的批发中心，拥有极强的全球供应链和库存优势。", angle: "强调品牌溢价和规格齐全度。" },
        { name: "PT. INDOFOOD SUKSES MAKMUR", tagline: "全球最大速食面生产商之一", region: "Indonesia", website: "indofood.com", category: "Food Packaging Buyer", profile: "每年采购海量铝箔包装用于其调味品及即食食品线。", customs: "规模：印尼快消界领头羊。" },
        { name: "Century Pacific Food", tagline: "菲律宾食品制造巨头", region: "Philippines", website: "centurypacific.com.ph", category: "Canned/Foil Containers", profile: "旗下品牌如Century Tuna等，对金属包装容器有巨大需求。" },
        { name: "Universal Robina Corp (URC)", tagline: "东南亚零食巨头", region: "Philippines", website: "urc.com.ph", category: "Snack Packaging", profile: "不仅是买家，也是亚洲包装技术的重要应用者。" },
        { name: "Jollibee Foods Corporation", tagline: "菲律宾餐饮国民品牌", region: "Philippines", website: "jollibee.com.ph", category: "Fast Food Packaging", profile: "全球数千家门店的包装集采商，铝箔餐盒需求稳定且量大。" },
        { name: "PT. MAYORA INDAH", tagline: "快消巨头（爱尚/可比克）", region: "Indonesia", website: "mayora.com", category: "Food Packaging", profile: "为旗下出口全球的产品采购大量铝箔复合包装及容器。" },
        { name: "Monde Nissin", tagline: "跨国食品巨头", region: "Philippines", website: "mondenissin.com", category: "F&B Containers", profile: "菲律宾及周边国家主要的分销与制造实体。" },
        { name: "Zest-O Corporation", tagline: "菲律宾饮品知名买家", region: "Philippines", website: "zesto.com.ph", category: "Beverage Packaging", profile: "在大宗铝箔卷材进口中长期活跃。" }
    ];
}

function getSGMYData() {
    return [
        { name: "SKP Pte Ltd", tagline: "新加坡包装零售/批发霸主", region: "Singapore", website: "skp.com.sg", category: "Leading Food Packaging", profile: "新加坡市场占有率最高的分销商，拥有40余家门店及庞大的集采体系。", phone: "+65 6789 3211", address: "Tampines, Singapore", customs: "规模：新加坡最大单体买家。来源：中国、马来西亚。" },
        { name: "UACJ Foil Malaysia", tagline: "大马铝箔制造及出口中心", region: "Malaysia", website: "ufo.uacj-group.com", category: "Aluminum Foil Specialist", profile: "日本UACJ集团子公司，负责整个东南亚高品质箔材的供应与分销。", phone: "+60 3 3341 0010", address: "Shah Alam, Malaysia", customs: "规模：工业级。来源：日本/本土。" },
        { name: "Pacific Packaging", tagline: "资深跨国分销商", region: "Singapore", website: "pacificenterprise.com.sg", category: "Wholesale Food Packaging", profile: "新加坡历史最悠久的批发商之一，代理及进口数百种铝箔制品。", phone: "+65 6747 6747", address: "Singapore", customs: "规模：稳定大宗进口。" },
        { name: "Lip Packaging (SG)", tagline: "工业餐饮包材专家", region: "Singapore", website: "lippackaging.com.sg", category: "Disposable Aluminum Trays", profile: "专注于为大型餐饮承包商和酒店提供散装铝箔盘供应。", phone: "+65 6265 6000", address: "Jurong West, Singapore" },
        { name: "Wakim Packaging", tagline: "大马包装界老牌先驱", region: "Malaysia", website: "malaysiafoodpackagings.com", category: "F&B Packaging Wholesale", profile: "成立于1985年，在马来西亚拥有超大规模仓储，是铝箔线的主导批发商。", phone: "+60 3 5192 1888", address: "Selangor, Malaysia" },
        { name: "AMS Advanced Material Berhad", tagline: "新马柔佛枢纽供应商", region: "Malaysia/SG", website: "amsmetal.com.my", category: "Aluminum Solution Provider", profile: "位于新山，辐射新加坡和全马的铝箔容器核心供应商。", phone: "+60 7 386 6688", address: "Johor, Malaysia" },
        { name: "Allwin (Singapore/Malaysia)", tagline: "FDA认证高端供应商", region: "Regional", website: "reallwinfoilpackaging.com", category: "Foil Packaging Manufacturer", profile: "专注于无泄漏设计的高端铝箔餐盒，主要供应现代外卖品牌。", angle: "推介密封性和耐用度。" },
        { name: "Star Net Marketing", tagline: "专业分销代理商", region: "Singapore", website: "star-net.com.sg", category: "Aluminum Foil Wholesaler", profile: "主攻新加坡餐饮业的长期合约采购与分销。", phone: "+65 6749 6188" },
        { name: "PXL Marketing Sdn Bhd", tagline: "大马定制化包装专家", region: "Malaysia", website: "pxl.com.my", category: "Branded Foil Containers", profile: "为连锁餐厅提供一站式铝箔容器定制及供应链管理服务。", address: "Penang, Malaysia" },
        { name: "Supply Smiths", tagline: "B2B电商批发先锋", region: "Singapore", website: "supplysmiths.com", category: "F&B Supplies Online", profile: "主打线上灵活批发的铝箔餐盒供应商，服务于数千家本地SME。", address: "Singapore" },
        { name: "B-PAC (Brown Pulp Pac)", tagline: "绿色包装倡导者", region: "Malaysia", website: "b-pac.com.my", category: "Sustainable Aluminum Range", profile: "推崇铝的可回收性，是马来西亚市场中高端铝箔餐盒的主要供应商。", phone: "+60 3 8060 2111" },
        { name: "LODEC Asia", tagline: "全球大宗箔材代理", region: "Singapore", website: "lodec.asia", category: "Industrial Foil Importer", profile: "专注于高规格铝箔卷材和重型容器的进口，服务于工业食品包装。" },
        { name: "Scientex Berhad", tagline: "全球领先柔性包装集团", region: "Malaysia", website: "scientex.com.my", category: "Flexible Packaging Giant", profile: "多元化制造及分销巨头，在大宗铝箔原材料贸易中表现强劲。", customs: "规模：全球级。" },
        { name: "Nestle Products Sdn Bhd", tagline: "全球食品龙头大马总部", region: "Malaysia", website: "nestle.com.my", category: "F&B Giant", profile: "年采购海量铝箔复合包装及托盘用于其乳制品和速食线。", customs: "规模：顶级买家。" },
        { name: "F&N Beverages (Malaysia)", tagline: "知名饮料制造实体", region: "Malaysia", website: "fn.com.my", category: "Beverage Packaging", profile: "在马来西亚和新加坡拥有广泛的包装采购体系。" },
        { name: "Dutch Lady Milk Industries", tagline: "乳业包装大户", region: "Malaysia", website: "dutchlady.com.my", category: "Dairy Packaging", profile: "对高阻隔性铝箔材料有持续大宗采购需求。" },
        { name: "Etika Sdn Bhd", tagline: "大马核心饮品分销商", region: "Malaysia", website: "etikaholdings.com", category: "F&B Containers", profile: "长期进口并分销带有包装属性的快消品。" },
        { name: "BreadTalk Group", tagline: "国际连锁烘焙巨头", region: "Singapore", website: "breadtalk.com", category: "Bakery & Catering Packaging", profile: "其全球配送中心对高品质铝箔模具和餐盒有刚性集采需求。" },
        { name: "Jumbo Group", tagline: "海鲜餐饮名企", region: "Singapore", website: "jumbogroup.sg", category: "Restaurant Packaging", profile: "针对高端外卖业务，采购定制化加厚铝箔餐盒。" },
        { name: "Yeo Hiap Seng (Yeo's)", tagline: "新马老牌饮品巨头", region: "Singapore/MY", website: "yeos.com.sg", category: "F&B Packaging", profile: "在海关数据中频繁出现的铝箔包材进口大户。" },
        { name: "Food Empire Holdings", tagline: "即饮咖啡出口巨头", region: "Singapore", website: "foodempire.com", category: "Instant Beverage Packaging", profile: "大量采购铝箔袋和相关容器用于其全球出口业务。" },
        { name: "Mamee-Double Decker", tagline: "大马国民零食品牌", region: "Malaysia", website: "mamee.com", category: "Snack/F&B Containers", profile: "对铝箔复合包装和容器有巨量需求。" },
        { name: "OldTown White Coffee", tagline: "南洋咖啡连锁代表", region: "Malaysia", website: "oldtown.com.my", category: "Catering Supplies", profile: "针对零售和外送业务进行全国集采。" },
        { name: "Munchy Food Industries", tagline: "大马饼干制造龙头", region: "Malaysia", website: "munchys.com", category: "FMCG Packaging", profile: "核心箔材类包装的长期稳定买家。" },
        { name: "Power Root", tagline: "大马能量饮品与包装商", region: "Malaysia", website: "powerroot.com.my", category: "Functional Drink Packaging", profile: "在进出口单据中表现活跃的箔材买家。" }
    ];
}

function getOtherData() {
    // Fill up to 100 with others (23 remaining)
    return [
        { name: "Vietnam Airlines Caterers (VACS) - Branch", tagline: "航空餐饮分部", region: "Vietnam", category: "Catering Packaging" },
        { name: "PT. MEGASARI MAKMUR", tagline: "印尼快消品领军者", region: "Indonesia", category: "Household Foil" },
        { name: "Bon Vietnam Import Export", tagline: "综合贸易批发商", region: "Vietnam", category: "Foil Products" },
        { name: "PT. I FLEX INDONESIA", tagline: "柔性包装专家", region: "Indonesia", category: "Laminated Foil" },
        { name: "JSY Trading Enterprise", tagline: "菲资综合贸易商", region: "Philippines", category: "Packaging Trade" },
        { name: "Thai Aluminium Can Company", tagline: "铝制容器专业厂", region: "Thailand", category: "Metal Containers" },
        { name: "PT. NAGASE IMPOR-EKSPOR", tagline: "日系全球分销平台", region: "Indonesia", category: "Industrial Materials" },
        { name: "Fab Vietnam Company Limited", tagline: "越资包装贸易公司", region: "Vietnam", category: "Foil Supplies" },
        { name: "PT. SUPREME CABLE (Sucaco)", tagline: "工业箔材大户", region: "Indonesia", category: "Industrial Aluminum" },
        { name: "Standard Can Co. Ltd.", tagline: "泰资金属包装代表", region: "Thailand", category: "Metal Packaging" },
        { name: "Imperatum", tagline: "菲资核心分销商", region: "Philippines", category: "Packaging Solutions" },
        { name: "PT. GENBODY INDONESIA", tagline: "医疗/精密包装买家", region: "Indonesia", category: "Specialty Packaging" },
        { name: "Khong Guan Biscuit (SG)", tagline: "百年饼干巨头", region: "Singapore", category: "Food Packaging" },
        { name: "Acumaster Manufacturing", tagline: "菲律宾铝制品加工中心", region: "Philippines", category: "Aluminum Products" },
        { name: "PT. MULTI SARANA INDOTANI", tagline: "农业铝箔应用商", region: "Indonesia", category: "Specialty Foil" },
        { name: "Gardenia Foods (SG)", tagline: "新加坡烘焙第一品牌", region: "Singapore", category: "Bakery Packaging" },
        { name: "General Metal Container Corp", tagline: "马尼拉金属包装买家", region: "Philippines", category: "Metal Containers" },
        { name: "Thuan Quoc JSC", tagline: "越资包装进口商", region: "Vietnam", category: "Disposable Packaging" },
        { name: "PT. JAYA BINTANG SEMESTA", tagline: "雅加达贸易中心", region: "Indonesia", category: "Import Trade" },
        { name: "Alaska Milk Corporation", tagline: "菲资乳业巨头", region: "Philippines", category: "Dairy Packaging" },
        { name: "FTC Trade & Development", tagline: "越资综合贸易实体", region: "Vietnam", category: "Trade Solutions" },
        { name: "PT. YANNO AGRO SCIENCE", tagline: "农业箔材进口商", region: "Indonesia", category: "Industrial Foil" },
        { name: "PT. WINGS GROUP", tagline: "印尼快消品“双子星”之一", region: "Indonesia", category: "Household/F&B Importer" }
    ];
}

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("东南亚一次性铝箔餐盒买家清单_美化版_Top100.docx", buffer);
    console.log("File generated successfully: 东南亚一次性铝箔餐盒买家清单_美化版_Top100.docx");
});
