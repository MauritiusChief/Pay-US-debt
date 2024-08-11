console.log('localization.js')

const defaultLocale = "zh";
const supportedLocale = ["zh", "en"];
let locale = defaultLocale;
// let locale = navigator.languages.map((locale) => locale.split("-")[0]);
let navLocal = navigator.languages[0].split('-')[0];
locale = supportedLocale.includes(navLocal) ? navLocal : defaultLocale;

// console.log(locale)

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