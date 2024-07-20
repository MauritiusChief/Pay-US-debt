// 最基础的数据
let coinCount = 0;
let coinsPerClick = 0;

// 人物相关数据
let health = 100.00;
let effectList = []
let workStat = 0; // 上班与否标记，用在资源列表更新中，0代表不上班1代表上班，以后可能会改一个方式
let estiCoinsPerClick = 12.5;
let workingProperty = ''

// 游戏机制数据
let goal = 100;
let dateArray = [1000, 0, 1, 8]
let currDate = new Date(...dateArray);
let gameFinished = false;
let currentTimer;
let gamePaused = true;

/** 商品及职业列表
 ***************/
// 加商品和职业可以很方便地在这里加
const shopList = [ // 商品列表
    {id:'buy-mini-truck', price:3500, dividedPrice:640, dividedMonth:6},
    {id:'buy-semi-truck', price:18500, dividedPrice:3400, dividedMonth:6},

    {id:'buy-health-elixir', price:50, dividedPrice:50, dividedMonth:0},

    {id:'buy-logistic-station', price:4500, dividedPrice:4500, dividedMonth:0}
]
let dividedBuyList = [];
//示例dividedBuyList:[ {id:'property-name', icon:'🎈', dividedPrice:10, dividedMonth:6, payCountDown:30} ]
let propertyList = [];
//示例propertyList:[ {id:'property-name', amount:1, maintainStatus:5, maintainDecrChance:0.5} ]
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
    selfResourceList.forEach( selfResourceType => {
        switch (selfResourceType.id) {
            case 'transport': // 运力
                switch (workingProperty) {
                    case 'semi-truck':
                        selfResourceType.produce = 85;
                        break;
                    case 'mini-truck':
                        selfResourceType.produce = 45;
                        break;
                    default:
                        selfResourceType.produce = 25;
                        break;
                }
                break;
        }
    });
    resourceList.forEach( resourceType => {
        resourceType.produce = 0;
        // 自动生产的资源
        switch (resourceType.id) {
            case 'transport':
                propertyList.forEach( propertyItem => {
                    propertyItem.id === 'logistic-station' ? resourceType.produce += 5*propertyItem.amount : {};
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
    var currentJobText = '';
    switch (workingProperty) {
        case 'semi-truck':
            currentJobText = '半挂车司机';
            break;
        case 'mini-truck':
            currentJobText = '小货车司机';
            break;
        default:
            currentJobText = '搬运工';
            break;
    }
    $('#current-job').text( currentJobText );
}

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
     * HTML更新：
     */
    let selfElement = $("#self");
    let medicinElement = $('#buy-health-elixir');
    if (health >= 0) {
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
        dividedBuyItem = dividedBuyList.find(item => item.id === propertyItem.id);
        if ( dividedBuyItem !== undefined ) { // 已有分期付款，只需更新数字
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = $(`#${propertyItem.id} .divided-month`);
            currDividedMonth.text( currDividedMonth.text().replace(/\d+/, dividedBuyItem.dividedMonth) );
            currPayCountDown = $(`#${propertyItem.id} .pay-count-down`);
            currPayCountDown.text( currPayCountDown.text().replace(/\d+/, dividedBuyItem.payCountDown) );
            // 更新商店按钮
            shopButton = $('#buy-'+propertyItem.id);
            shopButton.html( shopButton.html().replace('购买', '还款') );
        } else if ( $('#buy-'+propertyItem.id).html().includes('还款') ) { // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
            // 注意：这里用检测文本是否有“还款”来判定是否是分期商品
            $(`#${propertyItem.id} .divided-month`).html( '' );
            $(`#${propertyItem.id} .pay-count-down`).html( '' );
            // 更新商店按钮
            shopButton = $('#buy-'+propertyItem.id);
            shopButton.html( shopButton.html().replace('还款', '购买') );
        } // 到期不还款的情况在 updateDividedPay()

        // 更新劳动力分配面板
        propertyItem.id === workingProperty ? selfWork = 1 : selfWork = 0;
        $(`#${propertyItem.id} .work-force-limit`).text( propertyItem.amount-selfWork );
    })

    // 根据资产更新职业
    updateDisplayJob();

    /**更新资源列表的产量、收入等数字
     * 需要变量：
     *      resourceList
     * HTML更新：
     */
    resourceList.forEach( resourceType => {
        tableRow = $(`#${resourceType.id}`);
        tableRow.find(".net-produce .num").html( (resourceType.produce - resourceType.consume) );
        tableRow.find(".net-produce .produce").html( resourceType.produce );
        tableRow.find(".net-produce .consume").html( resourceType.consume );
        tableRow.find(".income .num").html( (resourceType.produce - resourceType.consume)*resourceType.price );
        tableRow.find(".income .price").html( resourceType.price );
    })
}
