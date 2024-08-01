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
        "click-job-porter": "搬运工",
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
        "click-job-porter": "Porter",
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