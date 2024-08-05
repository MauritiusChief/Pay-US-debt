console.log('localization.js')

const defaultLocale = "zh";
const supportedLocale = ["zh","en"];
let locale = defaultLocale;
// let locale = navigator.languages.map((locale) => locale.split("-")[0]);
let navLocal = navigator.languages[0].split('-')[0];
locale = supportedLocale.includes(navLocal) ? navLocal : defaultLocale ;

// console.log(locale)

const translations = {
    "zh": {
        "title": "美帝还债记",
        "disp-h": "挣钱帮美帝还债",
        "disp-debt": "美债总额: ",
        "disp-debt-time": "美债记录时间: ",
        "disp-income-ph": "每小时收入: ",
        "disp-earned": "已赚美元: ",
        "disp-to-goal": "距离目标: ",
        "disp-pause-inti": "开始",
        "disp-load": "加载中……",

        "game-pause": "暂停",
        "game-continue": "继续",

        "click-job": "当前工作: ",
        "click-date": "当前时间: ",
        "o-clock": "点",
        "click-wage": "工作时薪: ",
        "click-button": "努力赚美刀",

        "work-overtime": "（加班中）",
        "work-resting": "（休息中）",
        "click-job-mini-truck-driver": "小货车司机",
        "click-job-semi-truck-driver": "半挂车司机",
        "click-job-excavator-operator": "挖掘机操作员",
        "click-job-porter": "搬运工",

        "market": "市场",
        "installment": "分期付款",
        "mkt-buy": "购买",
        "mkt-install": "分期",
        "mkt-month": "月",
        "mkt-day": "天",
        "mkt-pay-ctd": "支付倒计时",
        "vehicle-market": "载具市场",
        "field-market": "地产市场",
        "shop": "商店",
        "shop-health-elixir": "健康药水",
        "employ": "雇佣",
        "mkt-mini-truck": "小货车",
        "mkt-mini-truck-prompt": "开小货车",
        "mkt-semi-truck": "半挂车",
        "mkt-semi-truck-prompt": "开半挂车",
        "mkt-excavator": "挖掘机",
        "mkt-excavator-prompt": "开挖掘机",
        "mkt-warehouse": "仓库",
        "mkt-hire": "雇用",
        "mkt-zombie": "脏比工人",
        "mkt-zombie-lore": "勤奋但脑子不太好",
        "mkt-vampire": "白脸专家",
        "mkt-vampire-lore": "毕业于德古拉堡大学",

        "resource": "资源",
        "resource-name": "名称",
        "resource-produce": "产出",
        "resource-income": "收入",
        "reso-unit-price": "单价",
        "reso-produce": "生产",
        "reso-consume": "消耗",
        "reso-h": "h",
        "reso-set": "组",
        "reso-transport": "运力",
        "reso-construct": "建造力",
        "reso-gear": "传动零件",
        "reso-nut-bolt": "连接零件",
        "reso-steel": "钢材",

        "property": "资产",
        "prop-health": "健康:",
        "prop-self": "这是你自己",
        "prop-zombie-lore": "正在担心胆固醇过高",
        "prop-vampire-lore": "喜欢收集遮阳伞和防晒霜",
        "dismiss-button": "解雇",

        "notice": "通知",

        "build": "建造",

        "setting": "设置",
        "setting-get-debt": "更新国债",
        "setting-get-debt-alert": "更新国债通常将导致游戏目标大幅增加，你确定吗？",
        "setting-save": "存储数据",
        "setting-load": "读取数据",
        "setting-saved": "数据存储成功！",
        "setting-loaded": "数据读取成功！",
        "setting-load-not-complete": "存在数据读取失败",
        "setting-reset": "清除数据",
        "setting-reset-alert": "你确定要清除已储存数据吗？",
        "setting-save-file": "存储至文件",
        "setting-load-file": "从文件读取",
        "setting-file-saved": "存储至文件成功！",
        "setting-file-loaded": "从文件读取成功！",
    },
    "en": {
        "title": "Pay US debt All",
        "disp-h": "Make Money to Pay U.S. Debts",
        "disp-debt": "Total U.S. debt: ",
        "disp-debt-time": "U.S. debt record time: ",
        "disp-income-ph": "Hourly Income: ",
        "disp-earned": "U.S. Dollar Earned: ",
        "disp-to-goal": "Debt Unpaid: ",
        "disp-pause-inti": "Start",
        "disp-load": "Loading...",

        "game-pause": "Pause",
        "game-continue": "Continue",

        "click-job": "Current Job: ",
        "click-date": "Current Date: ",
        "o-clock": " o'clock",
        "click-wage": "Hourly Wage: ",
        "click-button": "Work Hard to Earn $",

        "work-overtime": " (overtime)",
        "work-resting": " (resting)",
        "click-job-mini-truck-driver": "Mini Truck Driver",
        "click-job-semi-truck-driver": "Semi-trailer Truck Driver",
        "click-job-excavator-operator": "Excavator Operator",
        "click-job-porter": "Porter",

        "market": "Market",
        "installment": "installment",
        "mkt-buy": "Buy ",
        "mkt-install": "Instal. ",
        "mkt-month": " mo.",
        "mkt-day": " day(s)",
        "mkt-pay-ctd": "Pay in ",
        "vehicle-market": "Vehicle Market",
        "field-market": "Estate Market",
        "shop": "Shop",
        "shop-health-elixir": "Health Elixir",
        "employ": "Employment",
        "mkt-mini-truck": "Mini Truck",
        "mkt-mini-truck-prompt": "Drive Mini Truck",
        "mkt-semi-truck": "Semi-trailer Truck",
        "mkt-semi-truck-prompt": "Drive Semi-trailer Truck",
        "mkt-excavator": "Excavator",
        "mkt-excavator-prompt": "Operate Excavator",
        "mkt-warehouse": "Warehouse",
        "mkt-hire": "Hire ",
        "mkt-zombie": "Nzambi Worker",
        "mkt-zombie-lore": "Hard-working, but not very good at brains.",
        "mkt-vampire": "Palefase Expert",
        "mkt-vampire-lore": "Graduated from the University of Fort Dracula.",

        "resource": "Resource",
        "resource-name": "Name",
        "resource-produce": "Product",
        "resource-income": "Income",
        "reso-unit-price": "price",
        "reso-produce": "prod.",
        "reso-consume": "cons.",
        "reso-h": "h",
        "reso-set": "set",
        "reso-transport": "Transportation",
        "reso-construct": "Construction",
        "reso-gear": "Transmission Parts",
        "reso-nut-bolt": "Connecting Parts",
        "reso-steel": "Steel",

        "property": "Property",
        "prop-health": "Health:",
        "prop-self": "This is you.",
        "prop-zombie-lore": "Worrying about high cholesterol.",
        "prop-vampire-lore": "Likes to collect parasols and sunscreen.",
        "dismiss-button": "Dismiss",

        "notice": "Notice",

        "build": "Building",

        "setting": "Setting",
        "setting-get-debt": "Update Debt",
        "setting-get-debt-alert": "Updating U.S. debt will very likely increase the goal significantly, are you sure?",
        "setting-save": "Save data",
        "setting-load": "Load data",
        "setting-saved": "Data saved!",
        "setting-loaded": "Data loaded!",
        "setting-load-not-complete": "Exist data not loaded",
        "setting-reset": "Clear data",
        "setting-reset-alert": "Are you sure you want to clear all data saved?",
        "setting-save-file": "Save to file",
        "setting-load-file": "Load from file",
        "setting-file-saved": "Data saved to file!",
        "setting-file-loaded": "Data loaded from file!",
    },
}

// 执行翻译过程
$("[i18n-key]").each(translateElement);
$("[i18n-key-int]").each(translateElementInt);

function translateElementInt() {
    const key = $(this).attr("i18n-key-int");
    // console.log(key)
    // console.log(locale)
    const translation = translations[locale][key];
    $(this).html(translation);
}
function translateElement() {
    const key = $(this).attr("i18n-key");
    // console.log(key)
    // console.log(locale)
    const translation = translations[locale][key];
    $(this).html(translation);
}