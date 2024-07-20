

$('#mini-truck [type=decr]').click(() => {
    
})
$('#mini-truck [type=incr]').click(() => {
    
})
$('#mini-truck [type=checkbox]').on('change', () => {
    workingProperty = 'mini-truck';
    thisName = `#${workingProperty} [type=checkbox]`;
    if ($(thisName).is(':checked')) {
        $('#model-display [type=checkbox]').not(thisName).prop('checked', false);
    } else {
        workingProperty = ''
    }
})
$('#semi-truck [type=decr]').click(() => {
    
})
$('#semi-truck [type=incr]').click(() => {
    
})
$('#semi-truck [type=checkbox]').on('change', () => {
    workingProperty = 'semi-truck';
    thisName = `#${workingProperty} [type=checkbox]`;
    if ($(thisName).is(':checked')) {
        $('#model-display [type=checkbox]').not(thisName).prop('checked', false);
    } else {
        workingProperty = ''
    }
})
