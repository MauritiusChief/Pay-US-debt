let coinCount = 0;
let coinsPerClick = 0;
let health = 100.00;
let effectList = []
let workStat = 0; // 上班与否标记，用在资源列表更新中，0代表不上班1代表上班，以后可能会改一个方式
let estiCoinsPerClick = 12.5;

let goal = 100;
let dateArray = [1000, 0, 1, 8]
let currDate = new Date(...dateArray);
let gameFinished = false;
let currentTimer;
let gamePaused = true;

/** 商品及职业列表
 ***************/
const shopList = [ // 商品列表
    {id:'buy-mini-truck', price:3500, dividedPrice:640, dividedMonth:6},
    {id:'buy-semi-truck', price:18500, dividedPrice:3400, dividedMonth:6},

    {id:'buy-medicine', price:30, dividedPrice:30, dividedMonth:0},

    {id:'buy-logistic-station', price:4500, dividedPrice:4500, dividedMonth:0}
]
let dividedBuyList = [];
let propertyList = [];
let resourceList = [
    {id:'transport', produce:0, consume:0, stock:0, price:0.5}
]
let selfResourceList = [
    {id:'transport', produce:25}
]

/**根据资产更新资源产出和收入
 * 需要变量：
 *      resourceList
 *      selfResourceList
 * 更新变量：
 *      coinsPerClick
 *      estiCoinsPerClick
 */
function updateResource() {
    coinsPerClick = 0;
    resourceList.forEach( resourceType => {
        resourceType.produce = 0;
        // 自动生产的资源
        switch (resourceType.id) {
            case 'transport':
                propertyList.forEach( propertyItem => {
                    propertyItem === 'logistic-station' ? resourceType.produce += 5 : {};
                })
                break;
        }
        // 点击生产的资源
        selfResourceType = selfResourceList.find(type => type.id === resourceType.id );
        resourceType.produce += selfResourceType.produce * workStat; // workStat 0 代表不上班，1代表上班
        coinsPerClick += ((resourceType.produce - resourceType.consume) * resourceType.price); // 由于在这里自动和点击生产的资源都计入了此处，
        estiCoinsPerClick = selfResourceType.produce * resourceType.price;
    })
}
/**根据资产更新职业
 * 需要变量：
 *      propertyList
 * HTML更新
 */
function updateDisplayJob() {
    if (propertyList.includes('semi-truck')) {
        $('#current-job').text( '半挂车司机' );
    } else if (propertyList.includes('mini-truck')) {
        $('#current-job').text( '小货车司机' );
    } else {
        $('#current-job').text( '搬运工' );
    }
}

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
 * 使用函数：
 *      incrementTime()
 *      updateShop()
 *      updateDisplay()
 * HTML更新
 */ 
function everyHourEvent() {
    incrementTime();
    
    // 触发不上班效果 TODO:可以做成分开的函数
    workStat = 0;
    updateResource();
    coinCount += coinsPerClick;
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
        zombieTag.html( zombieTag.html().replaceAll('🧟‍♂️','⚰️') );
        vampireTag.html( vampireTag.html().replaceAll('🧛‍♂️','⚰️') );
    } else {
        zombieTag.html( zombieTag.html().replaceAll('⚰️','🧟‍♂️') );
        vampireTag.html( vampireTag.html().replaceAll('⚰️','🧛‍♂️') );
    }
    
    updateShop();
    updateDisplay();
    

    // console.log(propertyList)
    // console.log(dividedBuyList)
}
/**实际的步进时间事件
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

// 
/**点击挣钱按钮（工作点击触发的时间流逝）
 * 使用变量：
 *      selfResourceList
 * 使用函数：
 *      incrementTime()
 *      updateShop()
 *      updateDisplay()
 * HTML更新
 */ 
$('#click-button').click(() => {
    // 根据资产更新点击资源产量
    selfResourceList.forEach( selfResourceType => {
        switch (selfResourceType.id) {
            case 'transport':
                if (propertyList.includes('semi-truck')) {
                    selfResourceType.produce = 85;
                } else if (propertyList.includes('mini-truck')) {
                    selfResourceType.produce = 45;
                } else {
                    selfResourceType.produce = 25;
                }
                break;
        }
    });
    // 触发上班的效果
    workStat = 1;
    updateResource();
    coinCount += coinsPerClick;
    incrementTime();
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
    
    updateShop();
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

/** 更新显示（不是所有显示都在此更新）
 *********************************/
function updateDisplay() {
    // 基本文本更新
    $('#coin-count').text( `${coinCount.toLocaleString()} $` );
    $('#coins-per-click').text( `${estiCoinsPerClick.toLocaleString()} $` );
    $('#goal-remain').text( `${(goal - coinCount)>0 ? (goal - coinCount).toLocaleString() : 0} $` );
    $('#current-date').text( `${currDate.getFullYear()}年${(currDate.getMonth()+1)}月${currDate.getDate()}日${currDate.getHours()}点` );
    $('#health').text( health );

    /**健康值相关的图标跟新
     * 
     */
    let selfElement = $("#self");
    let medicinElement = $('#buy-medicine');
    if (health > 0) {
        medicinElement.addClass('hidden');
        selfElement.html( selfElement.html().replace('🚑', '🧍') );
    } else {
        medicinElement.removeClass('hidden');
        selfElement.html( selfElement.html().replace('🧍', '🚑') );
    }

    /**根据资产列表以及分期付款列表，更新分期付款文本的剩余分期月、剩余还款倒计时天数等
     * 需要变量：
     *      propertyList
     *      dividedBuyList
     * HTML更新：
     */
    propertyList.forEach( propertyItem => {
        // 分期付款期间 以及 偿清贷款 的情况
        dividedBuyItem = dividedBuyList.find(item => item.id === propertyItem);
        // 已有分期付款，只需更新数字
        if ( dividedBuyItem !== undefined ) {
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = $(`#${propertyItem} .divided-month`);
            currDividedMonth.text( currDividedMonth.text().replace(/\d+/, dividedBuyItem.dividedMonth) );
            currPayCountDown = $(`#${propertyItem} .pay-count-down`);
            currPayCountDown.text( ccurrPayCountDown.text().replace(/\d+/, dividedBuyItem.payCountDown) );
            // 更新商店按钮
            shopButton = $('#buy-'+propertyItem);
            shopButton.html( shopButton.html().replace('购买', '还款') );
        // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
        } else if ( $('#buy-'+propertyItem).html().includes('还款') ) { 
            // 注意：这里用检测文本是否有“还款”来判定是否是分期商品
            $(`#${propertyItem} .divided-month`).html( '' );
            $(`#${propertyItem} .pay-count-down`).html( '' );
            // 更新商店按钮
            shopButton = $('#buy-'+propertyItem);
            shopButton.html( shopButton.html().replace('还款', '购买') );
        } // 到期不还款的情况在 updateDividedPay()
    })

    // 根据资产更新职业
    updateDisplayJob();

    // 更新资源列表
    resourceList.forEach( resourceType => {
        tableRow = $(`#${resourceType.id}`);
        tableRow.find(".net-produce .num").html( (resourceType.produce - resourceType.consume) );
        tableRow.find(".net-produce .produce").html( resourceType.produce );
        tableRow.find(".net-produce .consume").html( resourceType.consume );
        tableRow.find(".income .num").html( (resourceType.produce - resourceType.consume)*resourceType.price );
        tableRow.find(".income .price").html( resourceType.price );
    })
}

/** 更新函数
 ***********/
// 更新商店按钮可购买选项
function updateShop() {
    shopList.forEach( shopItem => {
        if ( coinCount >= shopItem.dividedPrice) {
            $(`#${shopItem.id}`).prop('disabled', false);
        } else {
            $(`#${shopItem.id}`).prop('disabled', true);
        }
    })
    // 得病无法工作也借用此处
    ableToWork = health < 0 ? true : false;
    $("#click-button").prop('disabled', ableToWork)
}

// 更新分期付款到期未还款（包含相关更新显示）
function updateDividedPay() {
    dividedBuyList.forEach( dividedBuyItem => {
        dividedBuyItem.payCountDown--;
        if (dividedBuyItem.payCountDown === 0) {
            propertyList = propertyList.filter( item => { // 移除这个资产
                return item !== dividedBuyItem.id;
            });
            icon = $(`#${dividedBuyItem.id} .icon`);
            icon.text( icon.text().replace(dividedBuyItem.icon, "") );
            $(`#${dividedBuyItem.id} .divided-month`).text( '' );
            $(`#${dividedBuyItem.id} .pay-count-down`).text( '' );
            // 更新商店按钮
            shopButton = $('#buy-'+dividedBuyItem.id);
            shopButton.html( shopButton.html().replace('还款', '购买') );

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
        userKeyInput = ''; // Reset user input after successful cheat code entry
    }
    if (userKeyInput.toLowerCase().includes('money')) {
        coinCount += 6000
        userKeyInput = ''; // Reset user input after successful cheat code entry
    }
    if (userKeyInput.toLowerCase().includes('coin')) {
        coinCount += 500
        userKeyInput = ''; // Reset user input after successful cheat code entry
    }
    
    // Optional: Clear user input if it exceeds the cheat code length to avoid unnecessary memory usage
    if (userKeyInput.length > 20) {
        userKeyInput = userKeyInput.substring(1);
    }
});
