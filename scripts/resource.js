console.log('resource.js')

$('#laptop [type=checkbox]').on('change', () => {
    thisName = '#laptop [type=checkbox]';
    if ($(thisName).is(':checked')) { // 此勾选盒勾选的情况
        $('#model-display [type=checkbox]').not(thisName).prop('checked', false); // 选择所有其他勾选盒，取消勾选
        gameData.workingProperty = 'laptop'; // 办公了就不能干其他工作
    } else { // 此勾选盒不勾选的情况
        gameData.workingProperty = '';
    }
})

$('#mini-truck [type=decr]').click(() => {
    changeWorkForce(false, 'mini-truck', 'zombie')
})
$('#mini-truck [type=incr]').click(() => {
    changeWorkForce(true, 'mini-truck', 'zombie')
})
$('#mini-truck [type=checkbox]').on('change', () => {
    checkBoxEvent('mini-truck');
})
$('#semi-truck [type=decr]').click(() => {
    changeWorkForce(false, 'semi-truck', 'zombie')
})
$('#semi-truck [type=incr]').click(() => {
    changeWorkForce(true, 'semi-truck', 'zombie')
})
$('#semi-truck [type=checkbox]').on('change', () => {
    checkBoxEvent('semi-truck');
})
$('#excavator [type=decr]').click(() => {
    changeWorkForce(false, 'excavator', 'zombie')
})
$('#excavator [type=incr]').click(() => {
    changeWorkForce(true, 'excavator', 'zombie')
})
$('#excavator [type=checkbox]').on('change', () => {
    checkBoxEvent('excavator');
})

// 修改劳动力数量
function changeWorkForce(increaseWorkForce, propertyName, workForceName) {
    employeeItem = gameData.employeeList[workForceName];
    propertyItem = gameData.propertyList[propertyName];
    if (increaseWorkForce) { // 增加劳动力
        if (propertyItem.amount > propertyItem.amountUsed && employeeItem.amount > employeeItem.amountWorking) {
            propertyItem.amountUsed++;
            employeeItem.amountWorking++;
        }
    } else { // 减少劳动力
        if (propertyItem.amountUsed > 0 && employeeItem.amountWorking > 0) { // 注意：小人自己使用会让propertyItem.amountUsed +1
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
        if (gameData.propertyList[propertyName].amount > gameData.propertyList[propertyName].amountUsed) { // 确保有空余资产给小人自己用
            // 根据尚未被改变的gameData.workingProperty，判断上一个被使用的资产是什么
            if (gameData.propertyList[gameData.workingProperty] !== undefined) {
                gameData.propertyList[gameData.workingProperty].amountUsed--;
            }
            gameData.propertyList[propertyName].amountUsed++;
            gameData.workingProperty = propertyName; // gameData.workingProperty更新
        } else { // 否则取消勾选此勾选盒
            $(thisName).prop('checked', false);
        }
        // console.log(gameData.propertyList[propertyName])
    } else { // 此勾选盒不勾选的情况
        gameData.propertyList[propertyName].amountUsed--;
        gameData.workingProperty = ''
        // console.log(gameData.propertyList[propertyName])
    }
}
