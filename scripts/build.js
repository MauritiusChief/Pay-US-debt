console.log("加载build.js")

$('#build-office').click(() => {
    if ( $('#build-office .build-or-cancel').attr("i18n-key") == "build" ) { // 原文字为建造，变换成取消建造
        $('#build-office .build-or-cancel').attr("i18n-key", "build-cancel")
    } else { // 原文字为取消建造，变换成建造
        $('#build-office .build-or-cancel').attr("i18n-key", "build")
    }
    updateDisplay();
})