console.log('01-加载localization.js')

const defaultLocale = "zh";
const supportedLocale = ["zh", "en"];
let locale = defaultLocale;
// let locale = navigator.languages.map((locale) => locale.split("-")[0]);
let navLocal = navigator.languages[0].split('-')[0];
locale = supportedLocale.includes(navLocal) ? navLocal : defaultLocale;

// console.log(locale)

// 翻译
translations = {};
supportedLocale.forEach(code => {
    translations[code] = {};
})
// console.log(translations)
