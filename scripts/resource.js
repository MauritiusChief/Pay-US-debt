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

/**勾选盒变更事件，小人自己只能在一个地方工作
 * HTML更新
 * 更新变量：
 *      workingProperty
 */
function checkBoxEvent(propertyName) {
    workingProperty = propertyName;
    thisName = `#${workingProperty} [type=checkbox]`;
    if ($(thisName).is(':checked')) {
        $('#model-display [type=checkbox]').not(thisName).prop('checked', false);
    } else {
        workingProperty = ''
    }
}
