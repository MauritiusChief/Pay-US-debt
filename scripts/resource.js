console.log('07-加载resource.js')

$('#laptop [type=checkbox]').on('change', () => {
    checkBoxEvent('laptop');
})

// 绑定事件的通用函数
function bindEvents(item, workForceType, icon) {
    $(`#${item} [type=decr]`).click(() => {
        changeWorkForce(false, item, workForceType);
    });
    $(`#${item} [type=incr]`).click(() => {
        changeWorkForce(true, item, workForceType);
    });
    $(`#${item} [type=checkbox]`).on('change', () => {
        checkBoxEvent(item);
    });
    $(`#${item} [type=sell]`).click(() => {
        removeProperty(item, icon);
        gameData.coinCount += marketList[`buy-${item}`].price / 2;
        updateDisplay();
    });
}

// 为每个 item 绑定事件
bindEvents('mini-truck', 'zombie', '🚚');
bindEvents('semi-truck', 'zombie', '🚛');
bindEvents('excavator', 'zombie', '🏗️');
bindEvents('mini-bus', 'zombie', '🚐');
bindEvents('tuk-tuk', 'zombie', '🛺');
bindEvents('warehouse', 'zombie', '🏚️');
bindEvents('office', 'vampire', '🏢');

// 修改劳动力数量
function changeWorkForce(increaseWorkForce, propertyName, workForceName) {
    employeeItem = gameData.employeeList[workForceName];
    propertyItem = gameData.propertyList[propertyName];
    if (employeeItem === undefined) return; // 没有这种工人就直接退出
    if (increaseWorkForce) { // 增加劳动力
        if (propertyItem.amount > propertyItem.amountUsed && employeeItem.amount > employeeItem.amountWorking) {
            propertyItem.amountUsed++;
            employeeItem.amountWorking++;
        }
    } else { // 减少劳动力
        amountUsedLimit = propertyName === gameData.workingProperty ? 1 : 0 ;
        if (propertyItem.amountUsed > amountUsedLimit && employeeItem.amountWorking > 0) {
            propertyItem.amountUsed--;
            employeeItem.amountWorking--;
        }
    }
    // 锁定和解锁解雇按钮，避免人被解雇了其工作的资产还在运转
    if (employeeItem.amountWorking < employeeItem.amount) {
        $(`#dismiss-${workForceName}`).prop('disabled', false);
        delete gameData.disabledButton[`#dismiss-${workForceName}`];
    } else { // 无多余员工
        $(`#dismiss-${workForceName}`).prop('disabled', true);
        gameData.disabledButton[`#dismiss-${workForceName}`] = 1;
    }
    
    updateResource();
    updateDisplay();
    // console.log(employeeItem)
    // console.log(propertyItem)
}

/**勾选盒变更事件，小人自己只能在一个地方工作
 * HTML更新
 * 更新变量：
 *      gameData.workingProperty
 */
function checkBoxEvent(propertyName) {
    // console.log(gameData.propertyList[propertyName])
    thisName = `#${propertyName} [type=checkbox]`;
    if ($(thisName).is(':checked')) { // 此勾选盒勾选的情况

        $('#model-display [type=checkbox]').not(thisName).prop('checked', false); // 选择所有其他勾选盒，取消勾选
        // console.log(gameData.workingProperty)
        // 根据尚未被改变的gameData.workingProperty，判断上一个被使用的资产是什么
        if (gameData.workingProperty in gameData.propertyList) gameData.propertyList[gameData.workingProperty].amountUsed--;
        if ( gameData.propertyList[propertyName].amount > gameData.propertyList[propertyName].amountUsed) { // 确保有空余资产给小人自己用
            if (propertyName in gameData.propertyList) gameData.propertyList[propertyName].amountUsed++;
            gameData.workingProperty = propertyName; // gameData.workingProperty更新
        } else { // 否则取消勾选此勾选盒
            $(thisName).prop('checked', false);
            gameData.workingProperty = 'NONE';
        }
        // console.log(gameData.propertyList[propertyName])

    } else { // 此勾选盒不勾选的情况

        if (propertyName in gameData.propertyList) gameData.propertyList[propertyName].amountUsed--;
        gameData.workingProperty = 'NONE'
        // console.log(gameData.propertyList[propertyName])

    }
}
