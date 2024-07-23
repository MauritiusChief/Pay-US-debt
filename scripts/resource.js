console.log('resource.js')

$('#mini-truck [type=decr]').click(() => {
    
})
$('#mini-truck [type=incr]').click(() => {
    
})
$('#mini-truck [type=checkbox]').on('change', () => {
    checkBoxEvent('mini-truck');
})
$('#semi-truck [type=decr]').click(() => {
    
})
$('#semi-truck [type=incr]').click(() => {
    
})
$('#semi-truck [type=checkbox]').on('change', () => {
    checkBoxEvent('semi-truck');
})
$('#excavator [type=decr]').click(() => {
    
})
$('#excavator [type=incr]').click(() => {
    
})
$('#excavator [type=checkbox]').on('change', () => {
    checkBoxEvent('excavator');
})

/**勾选盒变更事件，小人自己只能在一个地方工作
 * HTML更新
 * 更新变量：
 *      workingProperty
 */
function checkBoxEvent(propertyName) {
    // console.log(propertyList[propertyName])
    thisName = `#${propertyName} [type=checkbox]`;
    if ($(thisName).is(':checked')) { // 此勾选盒勾选的情况
        $('#model-display [type=checkbox]').not(thisName).prop('checked', false); // 选中所有其他勾选盒，取消勾选
        // 根据尚未被改变的workingProperty，判断上一个被使用的资产是什么
        if (propertyList[workingProperty] !== undefined) {
            propertyList[workingProperty].inUse--;
        }
        propertyList[propertyName].inUse++;
        workingProperty = propertyName; // workingProperty更新
    } else { // 此勾选盒不勾选的情况
        propertyList[propertyName].inUse--;
        workingProperty = ''
    }
}
