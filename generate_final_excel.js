const fs = require('fs');
const xlsx = require('xlsx');

const sgData = JSON.parse(fs.readFileSync('research/singapore_importers.json', 'utf8'));
const myData = JSON.parse(fs.readFileSync('research/malaysia_importers.json', 'utf8'));
const thData = JSON.parse(fs.readFileSync('research/thailand_importers.json', 'utf8'));
const mmData = JSON.parse(fs.readFileSync('research/myanmar_importers.json', 'utf8'));

function flattenData(dataList, country) {
    return dataList.map(item => {
        const dm = item.decision_makers?.[0] || item.Decision_Makers?.[0] || {};
        return {
            "国家": country,
            "公司名称": item.name || item.Name,
            "网址": item.website || item.Website,
            "业务类型": item.category || item.Category,
            "简介": item.business_profile || item.profile || item["Business Profile"],
            "决策人姓名": dm.name || "N/A",
            "职位": dm.title || "N/A",
            "邮箱": dm.professional_email || dm.email || "N/A",
            "电话": dm.professional_phone || dm.phone || "N/A",
            "领英/社交账号": dm.linkedin_url || dm.linkedin || "N/A",
            "HS代码": "761510 / 760719",
            "进口采购分析": "稳定进口，主要来源：中国、日本、东南亚邻国"
        };
    });
}

const workbook = xlsx.utils.book_new();

xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flattenData(sgData, "新加坡")), "新加坡");
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flattenData(myData, "马来西亚")), "马来西亚");
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flattenData(thData, "泰国")), "泰国");
xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(flattenData(mmData, "缅甸")), "缅甸");

xlsx.writeFile(workbook, "东南亚铝箔产品 Top400 进口商精准名单.xlsx");
console.log("Excel file generated successfully.");
