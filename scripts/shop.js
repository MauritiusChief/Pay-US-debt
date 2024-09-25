console.log('06-加载shop.js')

$('#install-pay [type=checkbox]').on('change', () => {
    gameData.installPay = !gameData.installPay;
    // console.log(gameData.installPay)
    updateShop();
    updateDisplay();
})
$('#buy-mini-truck').click(() => {
    buyEvent('mini-truck', '🚚', 30);
    addToHiddenRemoved("#gear");
    addToHiddenRemoved("#nut-bolt");
})
$('#buy-semi-truck').click(() => {
    buyEvent('semi-truck', '🚛', 30);
    addToHiddenRemoved("#gear");
    addToHiddenRemoved("#nut-bolt");
})
$('#buy-excavator').click(() => {
    buyEvent('excavator', '🏗️', 30);
    addToHiddenRemoved("#gear");
    addToHiddenRemoved("#nut-bolt");
    addToHiddenRemoved("#construct");
})
$('#buy-warehouse').click(() => {
    buyEvent('warehouse', '🏚️', 30);
})

$('#buy-health-elixir').click(() => {
    shopItem = shopList['buy-health-elixir']
    gameData.coinCount -= shopItem.price;
    gameData.health += 20;
    updateDisplay();
})
$('#buy-laptop').click(() => {
    shopItem = shopList['buy-laptop']
    gameData.coinCount -= shopItem.price;
    gameData.propertyList['laptop'] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
    addToHiddenRemoved("#laptop");
    addToHiddenRemoved("#manage");
    deleteFromHiddenRemoved("#buy-laptop");
})

$('#employ-zombie').click(() => {
    employEvent('zombie', '🧟‍♀️', '🧟‍♂️');
    addToHiddenRemoved("#manage");
    addToHiddenRemoved(".use-worker");
    if (!'laptop' in gameData.propertyList) {
       addToHiddenRemoved("#buy-laptop");
    }
})
$('#dismiss-zombie').click(() => {
    dismissEvent('zombie', '🧟‍♀️', '🧟‍♂️');
})
$('#employ-vampire').click(() => {
    employEvent('vampire', '🧛‍♀️', '🧛‍♂️');
    addToHiddenRemoved("#manage");
    addToHiddenRemoved(".use-worker");
    if (!'laptop' in gameData.propertyList) {
       addToHiddenRemoved("#buy-laptop");
    }
})
$('#dismiss-vampire').click(() => {
    dismissEvent('vampire', '🧛‍♀️', '🧛‍♂️');
})


/**购买事件，根据钱数全款购买或者分期付款购买
 * 需要变量：
 *      gameData.installPay
 *      marketList
 *      gameData.coinCount
 * HTML更新：
 *      在模型面板添加emoji
 *      劳动力面板去除隐藏
 * 更新变量：
 *      gameData.propertyList（商品入库）
 *      gameData.installmentList（分期付款时，加上分期付款记录）
 */
function buyEvent(buyId, buyIcon, buyPayCountDown) {
    marketItem = marketList['buy-'+buyId];
    buyInstallPrice = marketItem.installPrice; // 改为直接用marketItem数据
    buyInstallMonth = marketItem.installMonth; // 改为直接用marketItem数据

    if (!gameData.installPay) { // 进入全款流程
        // console.log("进入全款流程")
        gameData.coinCount -= marketItem.price;
        // 资产列表添加商品
        addToPropertyList(buyId);

        $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
        updateIconStore(buyId);
        addToHiddenRemoved(`#${buyId}`);

    } else if ( buyPayCountDown > 0 && gameData.installPay) { // console.log("进入分期付款流程")
        // 这部分代码只有运行分期付款的商品才执行
        gameData.coinCount -= marketItem.installPrice;

        installmentItem = gameData.installmentList[buyId];
        if ( installmentItem !== undefined ) { // console.log('已有分期付款')
            if (installmentItem.installMonth > 1) { // console.log('还有1期以上')
                installmentItem.installMonth--;
                installmentItem.payCountDown = 30;
            }  else { // console.log('只剩1期，移除该分期付款')
                delete gameData.installmentList[buyId]
            }
        } else { // console.log('没有分期付款，创建新分期付款')
            gameData.installmentList[buyId] = {icon: buyIcon, installPrice: buyInstallPrice, installMonth: buyInstallMonth, payCountDown: buyPayCountDown};
            // 添加商品以及分期付款标识
            addToPropertyList(buyId);
            
            $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
            updateIconStore(buyId);
            $(`#${buyId} .install-month`).html( buyInstallMonth );
            $(`#${buyId} .pay-count-down`).html( buyPayCountDown );
            addToHiddenRemoved(`#install-${buyId}`);
            addToHiddenRemoved(`#${buyId}`);
            $("[i18n-key]").each(translateElement);
        }
    }
    // console.log(gameData.propertyList)
    updateShop();
    updateDisplay();
}

function employEvent(empId, iconF, iconM) {
    employItem = employList['employ-'+empId];
    employeeItem = gameData.employeeList[empId];
    empSalary = employItem.salary;
    if ( employeeItem !== undefined ) {// 已有这个商品
        employeeItem.amount++;
    } else { // 没有这个商品，创建这个商品
        gameData.employeeList[empId] = {amount: 1, amountWorking: 0, maintainStatus: 5, maintainDecrChance: 0.2};
    }
    gender = Math.random() > 0.5 ? 'F' : 'M';
    gameData.employeeGStack[empId] ? {} : gameData.employeeGStack[empId] = [];
    gameData.employeeGStack[empId].push(gender);
    empIcon = gender === 'F' ? iconF : iconM;
    $(`#${empId} .icon`).html( $(`#${empId} .icon`).html()+empIcon );
    updateIconStore(empId);
    addToHiddenRemoved(`#${empId}`);

    // 解锁解雇按钮
    if (gameData.employeeList[empId].amountWorking < gameData.employeeList[empId].amount) {
        $(`#dismiss-${empId}`).prop('disabled', false);
        delete gameData.disabledButton[`#dismiss-${empId}`];
    }

    updateResource();
    updateDisplay();
}

function dismissEvent(empId, iconF, iconM) {
    employeeItem = gameData.employeeList[empId];
    if (employeeItem.amount > 1) { // 劳动力数量-1
        employeeItem.amount--;
        // 锁定按钮，避免人被解雇了其工作的资产还在运转
        if (employeeItem.amountWorking >= employeeItem.amount) {
            $(`#dismiss-${empId}`).prop('disabled', true);
            gameData.disabledButton[`#dismiss-${empId}`] = 1;
        }
    } else { // 劳动力数量不足1，直接移除
        delete gameData.employeeList[empId];
        deleteFromHiddenRemoved(`#${empId}`);
    }
    icon = $(`#${empId} .icon`);
    iconToDelete = gameData.employeeGStack[empId].pop() === 'F' ? iconF : iconM;
    // 以下四行是为了实现删除最后一个emoji而不是第一个emoji的效果
    reversedHtml = icon.html().split('').reverse().join('');
    revIconToDelete = iconToDelete.split('').reverse().join('');
    reversedHtml = reversedHtml.replace(revIconToDelete, "");
    reversedHtml = reversedHtml.split('').reverse().join('');

    icon.html( reversedHtml );
    updateIconStore(empId);

    

    updateResource();
    updateDisplay();
}