console.log('main.js')

/** 初始化
 ********/
// 初始执行函数
updateShop();
updateDisplay();

// Fetch the current national debt
fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[number]=1&page[size]=1')
.then(response => response.json())
.then(data => {
    const totalDebt = data.data[0].tot_pub_debt_out_amt;
    const acquireDate = data.data[0].record_date
    goal = parseFloat(totalDebt);
    $('#goal').text( goal.toLocaleString() + " $" );
    $('#goal-remain').text( (goal - coinCount).toLocaleString() + " $" );
    $('#goal-date').text( acquireDate );
    let acquireDateArray = acquireDate.split("-");
    dateArray.splice(0, 3, ...acquireDateArray);
    $('#current-date').text( `${dateArray[0]}年${dateArray[1].replace(0,'')}月${dateArray[2].replace(0,'')}日${dateArray[3]}点` );
    dateArray[1]--;
    currDate = new Date(...dateArray);
})
.catch(error => {
    console.error('获取美债数据出错:', error);
    $('#goal').text( '数据获取失败' );
    $('#goal-date').text( '数据获取失败' );
});

/** 游戏机制 
 ***********/
/**每小时事件（特指不工作时定时触发的时间流逝）
 * 需要变量：
 *      currDate
 * 使用函数：
 *      incrementTime()
 *      updateShop()
 *      updateDisplay()
 * 更新变量：
 *      workStat（0，没上班）
 *      health
 * HTML更新
 */ 
function everyHourEvent() {

    // 触发不上班效果 TODO:可以做成分开的函数
    workStat = 0;
    // 不上班则回复健康
    if (currDate.getHours() < 9 ) { // 0-8点
        health < 0 ? {} : health += 2;
    } else { // 9点之后整天
        health < 0 ? {} : health += 1;
    }
    health > 100 ? health = 100 : {};
    // 消除（加班中）标记
    $('#overtime').text( '' );
    // 小人不加班时的图标
    $("[type=person]").each(function(index, personTag) {
        let $personTag = $(personTag);
        if (currDate.getHours() < 9 ) { // 0-8点
            $personTag.html( $personTag.html().replace('🧍','🛌') );
            $personTag.html( $personTag.html().replace('🛀','🛌') );
        } else if (currDate.getHours() > 16) { // 17-23点
            $personTag.html( $personTag.html().replace('🧍','🛀') );
        } else {
            $personTag.html( $personTag.html().replace('🛌','🧍') );
        }
    })
    zombieTag = $("#zombie");
    vampireTag = $("#vampire");
    if (currDate.getHours() < 9 ) { // 0-8点
        zombieTag.html( zombieTag.html().replaceAll('🧟','⚰️') );
        vampireTag.html( vampireTag.html().replaceAll('🧛','⚰️') );
    } else {
        zombieTag.html( zombieTag.html().replaceAll('⚰️','🧟') );
        vampireTag.html( vampireTag.html().replaceAll('⚰️','🧛') );
    }
    
    incrementTime();
    updateDisplay();
    

    // console.log(propertyList)
    // console.log(dividedBuyList)
}
/**实际的步进时间事件
 * 需要变量：
 *      coinCount
 *      actuIncomePerH
 * 使用函数：
 *      updateResource()
 * HTML更新
 */ 
function incrementTime() {
    currDate.setHours(currDate.getHours() + 1);
    switch (currDate.getHours()) {
        case 17:
        case 6:
            $('body').removeClass("dark-mode");
            $('body').addClass("dawn-mode");
            break;
        case 0:
            $('body').removeClass("dawn-mode");
            $('body').addClass("dark-mode");
            break;
        case 9:
            $('body').removeClass("dawn-mode");
            break;
        default:
            break;
    }
    if (currDate.getHours() === 10) {
        everyDayEvent();
    }

    // 无论时间流逝是定时触发还是点击触发都需执行的内容
    updateShop();
    updateResource();
    coinCount += actuIncomePerH;

    checkGoal()
}
/**每日事件
 */ 
function everyDayEvent() {
    updateDividedPay()
    if (currDate.getDate === 1) {
        everyMonthEvent();
    }
}
/**每月事件
 */
function everyMonthEvent() {

}

/**点击挣钱按钮（工作点击触发的时间流逝）
 * 需要变量：
 *      currDate
 * 使用函数：
 *      incrementTime()
 *      updateShop()
 *      updateDisplay()
 * 更新变量：
 *      workStat（1，上班）
 *      health
 *      gamePaused（false，解除暂停）
 * HTML更新
 */ 
$('#click-button').click(() => {

    // 触发上班的效果
    workStat = 1;
    // 变更上班与加班时的图标
    if (currDate.getHours() < 9 || currDate.getHours() > 16) {
        let selfElement = $("#self");
        selfElement.html( selfElement.html().replace('🛌', '🧍') );
        selfElement.html( selfElement.html().replace('🛀', '🧍') );
        if (!$('#overtime').text().includes("（加班中）")) {
            $('#overtime').text( "（加班中）" );
        }
    } else {
        $('#overtime').text( '' );
    }
    // 上班与加班时减少健康
    if (currDate.getHours() < 9 ) { // 0-8点
        health -= 2;
    } else if ( currDate.getHours() > 16 ) { // 17点-23点
        health -= 1.5;
    } else {
        health -= 1;
    }
    
    // 每次点击则重置计时，避免时间跳动
    clearInterval(currentTimer);
    currentTimer = setInterval(everyHourEvent, 1000);
    gamePaused = false;
    $('#game-pause').text( '暂停' );
    
    incrementTime();
    updateDisplay();
});

$('#game-pause').click(() => {
    if (gamePaused) { // 已暂停
        currentTimer = setInterval(everyHourEvent, 1000);
        $('#game-pause').text( '暂停' );
        gamePaused = false;
    } else { // 没暂停
        clearInterval(currentTimer);
        $('#game-pause').text( '继续' );
        gamePaused = true;
    }
})


/** 更新函数
 ***********/
/**商店按钮锁定与解锁；点击挣钱按钮锁定与解锁
 * 需要变量：
 *      marketList
 *      coinCount
 *      health
 * HTML更新：
 */
function updateShop() {
    for (let id in marketList) {
        limitPrice = dividePay ? marketList[id].dividedPrice : marketList[id].price;
        if ( coinCount >= limitPrice) {
            $(`#${id}`).prop('disabled', false);
        } else {
            $(`#${id}`).prop('disabled', true);
        }
    }
    // 得病无法工作也借用此处
    ableToWork = health < 0 ? true : false;
    $("#click-button").prop('disabled', ableToWork)
}

/**根据分期付款到期未还款更新或移除资产（包含相关更新显示）
 * HTML更新：
 *      删除分期付款文本的分期月、还款倒计时天数
 *      勾选盒取消勾选；劳动力面板隐藏
 * 更新变量：
 *      dividedBuyList
 *      propertyList（需保证dividedBuyList.item必须在propertyList中有对应）
 *      workingProperty
 */
function updateDividedPay() {
    dividedBuyList.forEach( dividedBuyItem => {
        dividedBuyItem.payCountDown--;
        if (dividedBuyItem.payCountDown === 0) {
            // 移除这个资产
            propertyItem = propertyList.find(item => {
                return item.id === dividedBuyItem.id
            })
            if (propertyItem.amount > 1) { // 资产数量-1
                propertyItem.amount--;
            } else { // 资产数量不足1，直接移除
                propertyList = propertyList.filter( item => { 
                    return item.id !== dividedBuyItem.id;
                });
                // 更新勾选盒以及workingProperty
                $('#model-display [type=checkbox]').not(dividedBuyItem.id).prop('checked', false);
                $(`#${dividedBuyItem.id}`).addClass('hidden');
                workingProperty === dividedBuyItem.id ? workingProperty = '' : {};
            }
            icon = $(`#${dividedBuyItem.id} .icon`);
            icon.html( icon.html().replace(dividedBuyItem.icon, "") );
            $(`#${dividedBuyItem.id} .divided-month`).text( '' );
            $(`#${dividedBuyItem.id} .pay-count-down`).text( '' );

            dividedBuyList = dividedBuyList.filter( item => { // 移除这个分期付款
                return item.id !== dividedBuyItem.id;
            });
        }
    })
}

function checkGoal() {
    if (coinCount >= goal && !gameFinished) {
        gameFinished = true;
        alert("恭喜你！你帮美帝还清了全部美债！星条旗永不落！");
    }
}

/** 作弊 */
let userKeyInput = ''
$(document).on('keydown', function(event) {
    const key = event.key;

    // Add the pressed key to the userInput string
    userKeyInput += key;

    // Check if the current input matches the cheat code
    if (userKeyInput.toLowerCase().includes('paxamericana')) {
        coinCount += 20000000000000
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('money')) {
        coinCount += 6000
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('coin')) {
        coinCount += 500
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('timefly')) { // 快速过5天
        clearInterval(currentTimer);
        Array(5*24).fill().forEach(() => everyHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(everyHourEvent, 1000);
        }
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('tictoc')) { // 快速过1天
        clearInterval(currentTimer);
        Array(24).fill().forEach(() => everyHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(everyHourEvent, 1000);
        }
        userKeyInput = '';
    }
    
    // Optional: Clear user input if it exceeds the cheat code length to avoid unnecessary memory usage
    if (userKeyInput.length > 20) {
        userKeyInput = userKeyInput.substring(1);
    }
});
