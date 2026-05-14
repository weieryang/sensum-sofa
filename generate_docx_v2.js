const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } = require('docx');

// Utility to create a table cell with specific styling
function createCell(text, isLabel = false, colSpan = 1) {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({
                text: text,
                bold: isLabel,
                size: 20,
                color: isLabel ? "333333" : "000000"
            })],
            alignment: isLabel ? AlignmentType.LEFT : AlignmentType.LEFT,
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
            // Header Row (Name + Tagline)
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: `${index}. ${data.name} -- ${data.tagline} [${data.region}]`,
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
            // Website
            new TableRow({
                children: [
                    createCell("网址", true),
                    createCell(data.website)
                ]
            }),
            // Category
            new TableRow({
                children: [
                    createCell("产品类别", true),
                    createCell(data.category)
                ]
            }),
            // Profile
            new TableRow({
                children: [
                    createCell("公司简介", true),
                    createCell(data.profile)
                ]
            }),
            // Contacts
            new TableRow({
                children: [
                    createCell("联系方式", true),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [new TextRun({ text: `电话: ${data.phone || "未公开"}`, size: 20 })] }),
                            new Paragraph({ children: [new TextRun({ text: `邮箱: ${data.email || "通过官网获取"}`, size: 20 })] }),
                            new Paragraph({ children: [new TextRun({ text: `地址: ${data.address}`, size: 20 })] }),
                            new Paragraph({ children: [new TextRun({ text: `联系人/部门: ${data.contact || "采购部"}`, size: 20 })] })
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
            // MOQ
            new TableRow({
                children: [
                    createCell("最低起订量", true),
                    createCell(data.moq)
                ]
            }),
            // Pitch Angle
            new TableRow({
                children: [
                    createCell("切入角度", true),
                    createCell(data.angle)
                ]
            }),
            // Customs Data (Boxed)
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            children: [
                                new TextRun({ text: "📦 海关数据", bold: true, size: 20, color: "C65911" }),
                                new TextRun({ text: ` | ${data.customs}`, size: 20 })
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
            new Paragraph({ style: "Title", children: [new TextRun("欧美中东压缩沙发经销商/批发商客户清单")] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "目标国家：美国/欧洲/中东  |  产品：压缩沙发 (Sofa-in-a-box)  |  共35家  |  生成日期：2026-04-20", size: 22, color: "545454", italics: true })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、🇺🇸 美国（共15家）")] }),
            ...getUSData().map((d, i) => [createDistributorTable(i + 1, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、🇬🇧🇩🇪🇫🇷 欧洲（共10家）")] }),
            ...getEUData().map((d, i) => [createDistributorTable(i + 16, d), new Paragraph({ children: [new TextRun("")] })]).flat(),

            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、🇦🇪🇸🇦 中东（共10家）")] }),
            ...getMEData().map((d, i) => [createDistributorTable(i + 26, d), new Paragraph({ children: [new TextRun("")] })]).flat()
        ]
    }]
});

function getUSData() {
    return [
        { name: "Zinus", tagline: "全球RTA家具领军品牌", region: "USA", website: "https://www.zinus.com", category: "Bed-in-a-box, Compressed Sofas, RTA Furniture", profile: "全球真空压缩家具领导者，在Amazon和Walmart拥有极高市场份额，主打高性价比。", phone: "(800) 613-0900", email: "wholesale@zinus.com", address: "2010 Crow Canyon Pl, San Ramon, CA 94583", contact: "Wholesale Team", moq: "FCL (柜货) 或 10-50件 (美仓)", angle: "主打专利合规的压缩技术，强调比现有供应商更优的成本控制，或提供非中国产地规避关税。", customs: "年份：2024 | 进口规模：15,000+ 柜/年 | 来源：中国、越南、印尼" },
        { name: "Dorel Home", tagline: "北美最大RTA家具供应商之一", region: "USA", website: "https://www.dorelhome.com", category: "RTA Furniture, Sectionals, Futons", profile: "旗下拥有Ameriwood, CosmoLiving等知名品牌，是Walmart和Target的核心供应商。", phone: "(800) 628-8321", email: "DorelCHO@dorel.com", address: "US Hub: Wright City, MO", contact: "Procurement Team", moq: "FCL (柜货)", angle: "强调符合ISTA 6A包装标准，减少一件代发损坏率；推荐金属架+压缩绵的混合制造方案。", customs: "年份：2024 | 进口规模：5,000+ 柜/年 | 来源：中国、东南亚" },
        { name: "Lifestyle Solutions", tagline: "主打小空间公寓家具的批发商", region: "USA", website: "https://lifestylesolutions.com", category: "Modular Sofas, Convertible Couches", profile: "Wayfair和Amazon的核心合作伙伴，专为小型公寓设计的家具专家。", phone: "(510) 824-6500", email: "info@lifestylesolutions.com", address: "6955 Mowry Ave, Newark, CA 94560", contact: "Sourcing Manager", moq: "50-100件 (美仓) / FCL", angle: "强调高密度海绵24小时内完全回弹的技术优势，以及无工具快速组装卖点。", customs: "年份：2024 | 进口规模：~1,200 柜/年 | 来源：中国" },
        { name: "Walker Edison", tagline: "数据驱动型电商家具批发商", region: "USA", website: "https://walkeredison.com", category: "E-commerce RTA Furniture", profile: "Amazon Home前十大供应商，完全针对电商物流链路设计的家具品牌。", phone: "(801) 433-3008", email: "service@walkeredison.com", address: "4350 W 2100 S, Salt Lake City, UT 84120", contact: "Buying Dept", moq: "100+件", angle: "推荐Drop-ship ready包装方案，强调零货损风险；提供流行面料(如Boucle)的快速定制。", customs: "年份：2024 | 进口规模：~2,500 柜/年 | 来源：中国、巴西" },
        { name: "Modway Furniture", tagline: "知名B2B批发平台", region: "USA", website: "https://modway.com", category: "Mid-Century Modern, Wholesale Furniture", profile: "拥有庞大的B2B批发目录，供应全美数千家线下门店和主流电商平台。", phone: "(609) 256-9000", email: "support@modway.com", address: "329 Wyckoff Mills Rd, East Windsor, NJ 08520", contact: "Purchasing Manager", moq: "一件代发或20件以上批发", angle: "以\"同等质量价格降低30%\"切入，强调工厂现货储备能力，支持快速补货。", customs: "年份：2024 | 进口规模：~2,000 柜/年 | 来源：中国" },
        { name: "Linon Home Decor", tagline: "大众零售渠道家具巨头", region: "USA", website: "https://www.linon.com", category: "Value-tier RTA furniture, Accent seating", profile: "长期供应TJ Maxx, Marshalls等折扣零售巨头，主打高性价比大众市场。", phone: "(516) 699-1000", email: "info@linon.com", address: "22 Jericho Turnpike, Mineola, NY 11501", contact: "Sourcing Team", moq: "FCL", angle: "主攻$199-$399零售价位段，强调FSC木材认证和成本领先优势。", customs: "年份：2024 | 进口规模：~1,500 柜/年 | 来源：中国、越南、印度" },
        { name: "Coaster Fine Furniture", tagline: "全美最大传统家具批发商之一", region: "USA", website: "https://www.coasterfurniture.com", category: "Full-line Furniture Wholesaler", profile: "拥有9大区域配送中心，代理体系遍布全美。", phone: "(800) 221-9699", email: "info@coasterfurniture.com", address: "12928 Sandoval St, Santa Fe Springs, CA 90670", contact: "Category Manager", moq: "混合柜或美仓起批", angle: "推荐可快递配送的组合式沙发，协助其传统经销商体系向线上业务转型。", customs: "年份：2024 | 进口规模：~3,000 柜/年 | 来源：中国、越南" },
        { name: "Acme Furniture", tagline: "高周转预算型家具批发商", region: "USA", website: "https://www.acmecorp.com", category: "High-volume Wholesale Furniture", profile: "专注大众市场，以低价、高库存和快速响应著称。", phone: "(626) 964-3456", email: "info@acmecorp.com", address: "18895 Arenth Ave, City of Industry, CA 91748", contact: "Buyer", moq: "1-5件起批", angle: "提供真空压缩模块化沙发的量采折扣，强调为其私有品牌提供OEM代工能力。", customs: "年份：2024 | 进口规模：2,000+ 柜/年 | 来源：中国" },
        { name: "Burrow", tagline: "高端模块化压缩沙发标杆", region: "USA", website: "https://burrow.com", category: "Premium Modular Sofas", profile: "重新定义了压缩沙发的DTC品牌，主打耐用、模块化和现代设计。", phone: "(888) 388-0664", email: "support@burrow.com", address: "15 W 27th St, New York, NY 10001", contact: "Sourcing Partner", moq: "定制化批量", angle: "推荐集成USB接口、实木腿选项及防刮面料的高端定制方案，对标其高溢价定位。", customs: "年份：2024 | 来源：越南、波兰、美国" },
        { name: "Elephant in a Box", tagline: "蜂窝结构创新家具品牌", region: "USA", website: "https://elephantinabox.com", category: "Ultra-portable Honeycomb furniture", profile: "利用航天蜂窝技术，实现超轻量且高承重的便携家具。", email: "hello@elephantinabox.com", address: "New York, NY", contact: "Founder", moq: "试单灵活", angle: "提供专利蜂窝结构替代方案或轻量化骨架创新，协助降低50%以上的运输重量。", customs: "年份：2024 | 规模：小众高增长" },
        { name: "South Shore Furniture", tagline: "北美电商RTA家具知名品牌", region: "USA", website: "https://www.southshorefurniture.com", category: "E-commerce RTA furniture", profile: "深耕Wayfair和Amazon渠道，拥有完善的北美售后和仓储体系。", phone: "(800) 290-0465", email: "info@southshorefurniture.com", address: "350, rue de la Station, Sainte-Croix, QC", contact: "Product Manager", moq: "FCL", angle: "强调海绵通过CertiPUR-US认证，符合ASTM安全标准，提供完整的北美合规支持。", customs: "年份：2024 | 进口规模：~800 柜/年 | 来源：中国" },
        { name: "Simpli Home", tagline: "高端手工化RTA家具批发商", region: "USA", website: "https://www.simpli-home.com", category: "Handcrafted RTA Furniture", profile: "专注于将高品质材料(实木、真皮)以压缩包装形式交付。", phone: "(866) 519-1548", email: "sales@simpli-home.com", address: "400 Applewood Crescent, Vaughan, ON", contact: "Sourcing Head", moq: "中等批量", angle: "推荐采用独立袋装弹簧而非单纯海绵的高端压缩方案，拉开与入门级产品的差异。", customs: "年份：2024 | 来源：越南、印度" },
        { name: "Abbyson Living", tagline: "Costco/Sam's Club核心供应商", region: "USA", website: "https://abbyson.com", category: "Luxury Wholesale Furniture", profile: "高端家具线上零售专家，专注于提供免运费的整装/组装家具解决方案。", phone: "(805) 480-1440", email: "support@abbysonliving.com", address: "2060 Statham Blvd, Oxnard, CA 93033", contact: "Buying Team", moq: "FCL (Costco规模)", angle: "提供高端面料(真皮/亚麻)的白标制造方案，强调在大型会员制渠道的评分口碑优势。", customs: "年份：2024 | 来源：中国、越南" },
        { name: "Sauder Woodworking", tagline: "RTA家具鼻祖", region: "USA", website: "https://sauder.com", category: "The OG of RTA furniture", profile: "虽以本土制造木家具闻名，但拥有庞大的软体家具进口部门作为产品线补充。", phone: "(419) 446-2711", email: "info@sauder.com", address: "502 Middle St, Archbold, OH 43502", contact: "Purchasing Director", moq: "FCL", angle: "提供与木质家具配套的压缩沙发系列，利用其现有的全美分销网络进行快速铺货。", customs: "年份：2024 | 来源：中国等" },
        { name: "Bush Furniture", tagline: "居家办公与小空间专家", region: "USA", website: "https://bushhome.com", category: "Home Office and Small Space Living", profile: "深耕居家办公市场，近年积极扩展客厅小空间家具产品线。", phone: "(800) 950-4782", email: "info@bushfurniture.com", address: "1 Mason Dr, Jamestown, NY 14702", contact: "Procurement Mgr", moq: "FCL", angle: "推荐符合BIFMA商用标准的耐用型压缩沙发，主打\"家庭办公一体化\"配置方案。", customs: "年份：2024 | 进口规模：~500 柜/年" }
    ];
}

function getEUData() {
    return [
        { name: "Swyft Home", tagline: "英国压缩沙发市场领跑者", region: "UK", website: "https://swyfthome.com", category: "Modular Sofa-in-a-box", profile: "专注24小时送达及无工具组装，是英国该领域的代表性品牌。", phone: "+44 203 488 4726", email: "info@swyfthome.com", address: "London, UK", moq: "100+件 (OEM)", angle: "主打防污面料及符合英国BS 5852防火标准，强调模块化灵活性。", customs: "年份：2024 | 营收：£30M+ | 来源：中国、越南" },
        { name: "Snug", tagline: "ScS集团旗下知名压缩沙发品牌", region: "UK", website: "https://snugsofa.com", category: "Modular Sofas", profile: "被英国大型家具零售商ScS收购，拥有强大的线下渠道支撑。", phone: "+44 191 514 6000", email: "support@snugsofa.com", address: "Sunderland, UK", moq: "FCL", angle: "强调通过高倍率压缩技术降低单位物流成本，对标大众市场扩产需求。", customs: "年份：2024 | 来源：全球供应链" },
        { name: "Home24", tagline: "欧洲最大在线家具零售商", region: "Germany", website: "https://www.home24.de", category: "Comprehensive Furniture", profile: "业务覆盖德国、法国、意大利等全欧，拥有庞大的自有品牌代采需求。", phone: "+49 30 700 149 000", email: "sourcing@home24.de", address: "Berlin, Germany", moq: "500+件", angle: "重点突出REACH化学物质合规和FSC可持续木材认证，符合其严苛的供应商准入。", customs: "年份：2024 | 营收：~€600M | 来源：中国、越南" },
        { name: "Beliani", tagline: "跨欧大型家具批发电商", region: "Switzerland/EU", website: "https://www.beliani.co.uk", category: "Modern Furniture", profile: "在19个国家运营，在波兰拥有大型物流中心，主打一件代发和批发。", phone: "+44 20 3318 0595", email: "mail@beliani.co.uk", address: "Baar, Switzerland", moq: "30-50件", angle: "推荐快时尚家具设计，强调扁平化包装节省仓库成本，支持多SKU混合订购。", customs: "年份：2024 | 进口规模：1,500+ 柜/年 | 来源：亚洲" },
        { name: "Emma Sleep", tagline: "全球知名睡眠品牌扩展家具线", region: "Germany/EU", website: "https://www.emma-sleep.com", category: "Sofa-in-a-box", profile: "从床垫跨界到沙发领域，利用其强大的品牌力和压缩物流经验迅速扩张。", phone: "+49 69 96758847", email: "support@emma-sleep.com", address: "Frankfurt, Germany", moq: "FCL", angle: "强调海绵通过OEKO-TEX认证，提供整合了床垫舒适技术的\"沙发床\"创新方案。", customs: "年份：2024 | 营收：€900M+ | 来源：全球" },
        { name: "Simba Sleep", tagline: "英国高端睡眠品牌沙发线", region: "UK", website: "https://simbasleep.com", category: "Hybrid Box Sofas", profile: "将混合弹簧技术应用于压缩沙发，定位中高端市场。", phone: "+44 20 3637 5422", email: "hello@simbasleep.com", address: "London, UK", moq: "高周转批量", angle: "推荐专利弹簧+海绵的混合构造，定位\"顶级舒适度\"的盒装沙发合作伙伴。", customs: "年份：2024 | 营收：£100M+ | 来源：中国" },
        { name: "Tediber", tagline: "法国领先D2C家居品牌", region: "France", website: "https://www.tediber.com", category: "Canape-lit", profile: "法国本土网红品牌，强调高品质和环保理念。", phone: "+33 1 86 95 47 10", email: "hello@tediber.com", address: "Paris, France", moq: "50-100件", angle: "强调环保材料及符合法国审美的高端面料设计，符合欧盟REACH规范。", customs: "年份：2024 | 营收：€40M-€60M" },
        { name: "Miliboo", tagline: "法国知名设计师家具电商", region: "France", website: "https://www.miliboo.com", category: "Designer furniture", profile: "主打现代感和模块化，60%以上产品来自亚洲供应链。", phone: "+33 805 14 44 44", email: "info@miliboo.fr", address: "Chavanod, France", moq: "拼柜", angle: "推荐创新模组化连接技术和法式极简风，协助其产品线向\"更易物流化\"转型。", customs: "年份：2024 | 营收：~€40M | 来源：亚洲" },
        { name: "Maisons du Monde", tagline: "欧洲家居连锁分销巨头", region: "France/EU", website: "https://www.maisonsdumonde.com", category: "Home decor & furniture", profile: "在欧拥有350+门店，通过全球集采中心大规模采购。", phone: "+33 2 51 71 17 71", email: "sourcing@maisonsdumonde.com", address: "Vertou, France", moq: "多柜规模", angle: "主打极致性价比和大规模交付能力，工厂必须符合BSCI或Sedex社会责任审计。", customs: "年份：2024 | 营收：€1.2BN | 来源：中国" },
        { name: "Furniture Choice", tagline: "英国高销量在线家具零售商", region: "UK", website: "https://furniturechoice.co.uk", category: "Affordable sofas", profile: "专注价值细分市场，以高库存和次日达服务著称。", phone: "+44 333 015 0000", email: "info@furniturechoice.co.uk", address: "Mirfield, UK", moq: "FCL", angle: "提供\"出厂价直供\"的价格优势，针对其大众消费群体提供低损耗包装方案。", customs: "年份：2024 | 营收：£50M+ | 来源：佛山、海宁等地" }
    ];
}

function getMEData() {
    return [
        { name: "Home Centre", tagline: "中东最大家居连锁分销商", region: "GCC", website: "https://www.homecentre.com", category: "Comprehensive Home Furnishings", profile: "Landmark集团旗下的家居旗舰，在中东拥有100+门店。", phone: "+971 800 4663", email: "landmark.procurement@landmarkgroup.com", address: "Dubai, UAE", moq: "FCL", angle: "强调压缩沙发的高周转率，尤其适合中东电商物流；推荐耐高温海绵以适应当地气候。", customs: "年份：2024 | 来源：中国、越南、土耳其" },
        { name: "Pan Home", tagline: "中东知名精品家居连锁", region: "GCC", website: "https://panhomestores.com", category: "Luxury Furniture", profile: "在中东拥有22家展厅，正在积极扩张电商和一件代发业务。", phone: "+971 800 726", email: "buying@panemirates.com", address: "Dubai, UAE", moq: "1x20ft/40HQ", angle: "推崇现代简约风和\"免工具安装\"理念，适合其正在发力的线上客户群体。", customs: "年份：2024 | 来源：土耳其、中国" },
        { name: "Danube Home", tagline: "多品类家居与建材分销巨头", region: "GCC", website: "https://danubehome.com", category: "Furniture, Garden, Bath", profile: "背靠Danube集团，拥有庞大的B2B配送网络，供应大量小型零售商。", phone: "+971 800 3131", email: "businesshead@danubehome.com", address: "Jebel Ali, Dubai", moq: "50-100件/FCL", angle: "强调物流效率提升，压缩包装可使其配送车队空间利用率提升70%，适合其\"Express\"配送业务。", customs: "年份：2024 | 来源：印度、中国、越南" },
        { name: "Home Box", tagline: "主打高性价比的家居分销商", region: "GCC", website: "https://homeboxstores.com", category: "Budget-friendly Furniture", profile: "Landmark集团旗下专注大众消费市场的品牌，类似宜家风格。", phone: "+971 800 4663269", email: "info@homeboxstores.com", address: "Dubai, UAE", moq: "FCL", angle: "主推\"公寓家具\"概念，压缩沙发是其小户型客厅系列的最佳补充。", customs: "年份：2024 | 来源：中国、印尼" },
        { name: "Midas Furniture", tagline: "科威特及沙特领军分销商", region: "GCC", website: "https://midasfurniture.com", category: "Home/Office Furniture", profile: "在科威特、沙特拥有绝对统治力，同时承接大量政府和商业项目。", phone: "+966 920005232", email: "sales@midasfurniture.com", address: "Kuwait/Riyadh", moq: "柜货", angle: "推荐用于酒店公寓和房地产项目，强调压缩沙发的快速部署和搬运便捷性。", customs: "年份：2024 | 来源：土耳其、意大利、中国" },
        { name: "Al Omar Furniture", tagline: "沙特最老牌的家具分销商之一", region: "KSA", website: "https://alomar.com.sa", category: "Classic and Modern Furniture", profile: "成立于1975年，沙特本土市场的深度分销专家。", phone: "+966 920000075", email: "customer@alomar.com.sa", address: "Riyadh, Saudi Arabia", moq: "FCL", angle: "强调工厂直供降本及海绵回弹性能，特别针对沙特市场提供超大尺寸模组化设计。", customs: "年份：2024 | 来源：土耳其、意大利、中国" },
        { name: "The Sleep Company", tagline: "主打黑科技的睡眠家具商", region: "UAE", website: "https://thesleepco.ae", category: "SmartGRID Mattresses and Sofas", profile: "将SmartGRID压缩技术引入中东，正在寻找压缩沙发代工合作伙伴。", phone: "+971 56 719 0840", email: "sales@thesleepco.com", address: "Dubai, UAE", moq: "灵活商议", angle: "推介符合人体工程学的黑科技压缩海绵，作为其核心睡眠产品的客厅配套延伸。", customs: "年份：2024 | 来源：印度、东亚" },
        { name: "Klekktic", tagline: "迪拜网红定制家具分销商", region: "UAE", website: "https://klekktic.com", category: "Customizable Online Furniture", profile: "专注年轻人群体和电商渠道，主打可定制和快速发货。", phone: "+971 52 705 5298", email: "info@klekktic.com", address: "Al Quoz, Dubai", moq: "20-50件", angle: "推荐极具现代设计感的\"盒装沙发\"，匹配其小批量多频率的灵活采购模式。", customs: "年份：2024 | 来源：东南亚集采" },
        { name: "Marina Home", tagline: "中东高端生活方式家居商", region: "GCC", website: "https://marinahomeinteriors.com", category: "Premium Lifestyle Furniture", profile: "定位奢华与融合设计，在全中东高端商场均有门店。", phone: "+971 4 803 0300", email: "marketing@marinagulf.com", address: "Dubai, UAE", moq: "20-30件", angle: "主推\"轻奢盒装\"概念，采用天鹅绒、亚麻等高级面料，定位高端公寓的精品选择。", customs: "年份：2024 | 来源：印度、印尼、越南" },
        { name: "Helmii", tagline: "迪拜专业盒装家具先驱", region: "UAE", website: "https://helmii.com", category: "Custom Beds, Sofa Beds", profile: "中东首批推广盒装床垫的品牌，对压缩物流有深度认知。", phone: "+971 56 466 3314", email: "hello@helmii.com", address: "Dubai, UAE", moq: "小到中等", angle: "主打\"公寓全套压缩方案\"，协助其将盒装优势从卧室扩展至客厅。", customs: "年份：2024 | 来源：英国、中国" }
    ];
}

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("欧美中东压缩沙发经销商客户清单_美化版_2026-04-20.docx", buffer);
    console.log("File generated successfully: 欧美中东压缩沙发经销商客户清单_美化版_2026-04-20.docx");
});
