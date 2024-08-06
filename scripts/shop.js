console.log('shop.js')

$('#install-pay [type=checkbox]').on('change', () => {
    gameData.installPay = !gameData.installPay;
    // console.log(gameData.installPay)
    updateShop();
    updateDisplay();
})
$('#buy-mini-truck').click(() => {
    buyEvent('mini-truck', '🚚', 30);
    $("#gear").removeClass("hidden");
    $("#nut-bolt").removeClass("hidden");
    gameData.removeHidden["#gear"] = 1;
    gameData.removeHidden["#nut-bolt"] = 1;
})
$('#buy-semi-truck').click(() => {
    buyEvent('semi-truck', '🚛', 30);
    $("#gear").removeClass("hidden");
    $("#nut-bolt").removeClass("hidden");
    gameData.removeHidden["#gear"] = 1;
    gameData.removeHidden["#nut-bolt"] = 1;
})
$('#buy-excavator').click(() => {
    buyEvent('excavator', '<img src="icons/excavator.svg" alt="🚜" class="svg-icon">', 30);
    $("#construct").removeClass("hidden");
    $("#gear").removeClass("hidden");
    $("#nut-bolt").removeClass("hidden");
    gameData.removeHidden["#construct"] = 1;
    gameData.removeHidden["#gear"] = 1;
    gameData.removeHidden["#nut-bolt"] = 1;
})
$('#buy-warehouse').click(() => {
    buyEvent('warehouse', '<img src="icons/warehouse.svg" alt="📦" class="svg-icon">', 30);
})

$('#buy-health-elixir').click(() => {
    shopItem = shopList['buy-health-elixir']
    gameData.coinCount -= shopItem.price;
    gameData.health += 20;
})
$('#buy-laptop').click(() => {
    shopItem = shopList['buy-laptop']
    gameData.coinCount -= shopItem.price;
    gameData.propertyList['laptop'] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
    $('#laptop').removeClass('hidden');
    $("#manage").removeClass("hidden");
    gameData.removeHidden["#manage"] = 1;
    gameData.removeHidden['#laptop'] = 1;
    $('#buy-laptop').addClass('hidden');
    delete gameData.removeHidden['#buy-laptop'];
})

$('#employ-zombie').click(() => {
    employEvent('zombie', '🧟‍♀️', '🧟‍♂️');
    $('.use-worker').removeClass('hidden');
    $("#manage").removeClass("hidden");
    gameData.removeHidden["#manage"] = 1;
    gameData.removeHidden[".use-worker"] = 1;
})
$('#dismiss-zombie').click(() => {
    dismissEvent('zombie', '🧟‍♀️', '🧟‍♂️');
})
$('#employ-vampire').click(() => {
    employEvent('vampire', '🧛‍♀️', '🧛‍♂️');
    $('.use-worker').removeClass('hidden');
    $("#manage").removeClass("hidden");
    gameData.removeHidden["#manage"] = 1;
    gameData.removeHidden[".use-worker"] = 1;
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
        propertyItem = gameData.propertyList[buyId];
        if ( propertyItem !== undefined ) {// 已有这个商品
            propertyItem.amount++;
        } else { // 没有这个商品，创建这个商品
            gameData.propertyList[buyId] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
        }

        $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
        gameData.iconStore[`#${buyId} .icon`] = $(`#${buyId} .icon`).html();
        $(`#${buyId}`).removeClass('hidden'); // 去除隐藏
        gameData.removeHidden[`#${buyId}`] = 1;

    } else if ( buyPayCountDown > 0 && gameData.installPay) { // 进入分期付款流程
        // console.log("进入分期付款流程")
        // 这部分代码只有运行分期付款的商品才执行
        gameData.coinCount -= marketItem.installPrice;

        installmentItem = gameData.installmentList[buyId];
        if ( installmentItem !== undefined ) { // 已有分期付款
            // console.log('已有分期付款')
            if (installmentItem.installMonth > 1) { // 还有1期以上
                // console.log('还有1期以上')
                installmentItem.installMonth--;
                installmentItem.payCountDown = 30;
            }  else { // 只剩1期，移除该分期付款
                // console.log('只剩1期，移除该分期付款')
                delete gameData.installmentList[buyId]
            }
        } else { // 没有分期付款，创建新分期付款
            // console.log('没有分期付款，创建新分期付款')
            gameData.installmentList[buyId] = {icon: buyIcon, installPrice: buyInstallPrice, installMonth: buyInstallMonth, payCountDown: buyPayCountDown};
            // 添加商品以及分期付款标识
            propertyItem = gameData.propertyList[buyId];
            if ( propertyItem !== undefined ) {// 已有这个商品
                propertyItem.amount++;
            } else { // 没有这个商品，创建这个商品
                gameData.propertyList[buyId] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
            }
            
            $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
            gameData.iconStore[`#${buyId} .icon`] = $(`#${buyId} .icon`).html();
            $(`#${buyId} .install-month`).html( buyInstallMonth );
            $(`#${buyId} .pay-count-down`).html( buyPayCountDown );
            $(`#install-${buyId}`).removeClass('hidden'); // 去除分期的隐藏
            $(`#${buyId}`).removeClass('hidden'); // 去除隐藏
            gameData.removeHidden[`#install-${buyId}`] = 1;
            gameData.removeHidden[`#${buyId}`] = 1;
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
    gameData.iconStore[`#${empId} .icon`] = $(`#${empId} .icon`).html();
    $(`#${empId}`).removeClass('hidden'); // 去除隐藏
    gameData.removeHidden[`#${empId}`] = 1;

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
        $(`#${empId}`).addClass('hidden');
        delete gameData.removeHidden[`#${empId}`];
    }
    icon = $(`#${empId} .icon`);
    iconToDelete = gameData.employeeGStack[empId].pop() === 'F' ? iconF : iconM;
    // 以下四行是为了实现删除最后一个emoji而不是第一个emoji的效果
    reversedHtml = icon.html().split('').reverse().join('');
    revIconToDelete = iconToDelete.split('').reverse().join('');
    reversedHtml = reversedHtml.replace(revIconToDelete, "");
    reversedHtml = reversedHtml.split('').reverse().join('');

    icon.html( reversedHtml );
    gameData.iconStore[`#${empId} .icon`] = icon.html();

    

    updateResource();
    updateDisplay();
}