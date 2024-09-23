console.log("加载build.js")

$('#build-office').click(() => {
    if ( $('#build-office .build-or-cancel').attr("i18n-key") == "build" ) { // 当前为建造
        gameData.constructList['office'] = {icon:'🏢', constructInputed:0, constructTotal: buildList['build-office'].constructTotal}
        // 建筑展示
        addToHiddenRemoved('#office');
        addToHiddenRemoved('#construct-office');
        if (gameData.propertyList['office' === undefined]) deleteFromHiddenRemoved('#office .work-force')
        console.log( $('#office .work-force') )

        $(`#office .icon`).html( $(`#office .icon`).html()+'🏗️' );
        updateIconStore('office');
        $('#build-office .build-or-cancel').attr("i18n-key", "build-cancel") // 原文字为建造，变换成取消建造
    } else { // 当前为取消建筑
        delete gameData.constructList['office'];
        // 建筑展示
        if (gameData.propertyList['office' === undefined]) deleteFromHiddenRemoved('#office');
        deleteFromHiddenRemoved('#construct-office');

        $(`#office .icon`).html( $(`#office .icon`).html().replace('🏗️', "") );
        updateIconStore('office');
        $('#build-office .build-or-cancel').attr("i18n-key", "build") // 原文字为取消建造，变换成建造
    }
    updateDisplay();
})