console.log('加载display.js')

/** 更新显示（不是所有显示都在此更新）
 *********************************/
function updateDisplay() {
    // 基本文本更新
    $('#coin-count').text(`${gameData.coinCount.toFixed(2).toLocaleString()} $`);
    $('#coin-per-hour').text(`${actuIncomePerH.toFixed(2).toLocaleString()} $`);
    $('#coins-per-click').text(`${estiIncomePerH.toLocaleString()} $`);
    $('#goal-remain').text(`${(gameData.goal - gameData.coinCount) > 0 ? parseFloat((gameData.goal - gameData.coinCount).toFixed(2)).toLocaleString() : 0} $`);
    $('#current-date').html(`${gameData.currDate.getFullYear()}-${(gameData.currDate.getMonth() + 1).toString().padStart(2, '0')}-${gameData.currDate.getDate().toString().padStart(2, '0')};  ${genClockIcon(gameData.currDate.getHours())}${gameData.currDate.getHours()}<span i18n-key="o-clock"></span>`);
    $('#health').text(Math.round(gameData.health * 100) / 100); // 避免 1.099999999 这样的数字出现

    /**健康值相关的图标跟新
     * 需要变量：
     *      gameData.health
     * HTML更新：
     */
    let selfElement = $("#self .icon");
    if (gameData.health >= 0) {
        addToHiddenRemoved("#buy-health-elixir");
        if (gameData.currDate.getHours() < 9 && gameData.workStat == 0) { // 0-8点
            selfElement.html('🛌');
        } else if (gameData.currDate.getHours() > 16 && gameData.workStat == 0) { // 17-23点
            selfElement.html('🛀');
        } else {
            selfElement.html(GIcon[gameData.GIdx]);
        }
    } else {
        addToHiddenRemoved("#buy-health-elixir");
        selfElement.html('🚑');
    }

    /**根据资产列表以及分期付款列表，更新分期付款文本的剩余分期月、剩余还款倒计时天数等
     * 需要变量：
     *      gameData.propertyList
     *      gameData.installmentList
     * HTML更新：
     */
    for (let id in gameData.propertyList) {
        // 分期付款期间 以及 偿清贷款 的情况
        installmentItem = gameData.installmentList[id];
        if (installmentItem !== undefined) { // 已有分期付款，只需更新数字
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = $(`#${id} .install-month`);
            currDividedMonth.text(installmentItem.installMonth);
            currPayCountDown = $(`#${id} .pay-count-down`);
            currPayCountDown.text(installmentItem.payCountDown);
        } else if ($(`#${id}:has(.install-month)`).length > 0) { // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
            addToHiddenRemoved(`install-${id}`);
        } // 到期不还款的情况在 updateInstallment()

        // 更新劳动力分配面板
        $(`#${id} .work-force-limit`).text(gameData.propertyList[id].amount);
        $(`#${id} .work-force-input`).text(gameData.propertyList[id].amountUsed);
        // console.log(gameData.propertyList[id].amountUsed)
    }


    // 更新商店按钮
    $('.buy-or-install').attr('i18n-key', gameData.installPay ? 'mkt-install' : 'mkt-buy');

    // 根据资产更新职业
    updateDisplayJob();

    /**更新资源列表的产量、收入等数字
     * 需要变量：
     *      gameData.resourceList
     * HTML更新：
     */
    for (let id in gameData.resourceList) {
        let resource = gameData.resourceList[id];
        tableRow = $(`#${id}`);
        tableRow.find(".net-produce .num").html((resource.produce - resource.consume).toFixed(2));
        tableRow.find(".net-produce .produce").html(resource.produce.toFixed(2));
        tableRow.find(".net-produce .consume").html(resource.consume.toFixed(2));
        let netProduct = resource.produce - resource.consume;
        priceMultiplier = netProduct < 0 ? resource.buy : 1;
        tableRow.find(".income .num").html((netProduct * resource.price * priceMultiplier).toFixed(2));
        tableRow.find(".income .price").html(netProduct < 0 ? -(resource.price * priceMultiplier).toFixed(2).toLocaleString() : resource.price.toFixed(2).toLocaleString());
    }
    // 管理力的小彩蛋
    $("#use-laptop-lore").attr('i18n-key', gameData.resourceList['manage'].consume > 0 ? "prop-use-laptop" : "prop-use-laptop-alt")

    $("[i18n-key]").each(translateElement); // 更新文本翻译
}

function genClockIcon(time) {
    const icons = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
    return icons[time % 12];
}