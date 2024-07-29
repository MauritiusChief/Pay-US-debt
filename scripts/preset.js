console.log('preset.js')
// 最基础的数据
let coinCount = 0;
let actuIncomePerH = 0;

// 人物相关数据
let health = 100.00;
let effectList = []
let workStat = 0; // 上班与否标记，用在资源列表更新中，0代表不上班1代表上班，以后可能会改一个方式
let estiIncomePerH = 12.5;
let workingProperty = ''
var GIdx = 0
const GIcon = ['🧍','🧍‍♂️','🧍‍♀️']
const GTxt = ['?','♂','♀']

// 游戏机制数据
let goal = 1000000;
let dateArray = [1000, 0, 1, 8]
let currDate = new Date(...dateArray);
let gameFinished = false;
let currentTimer;
let gamePaused = true;
let dividePay = false;
let cheatWork = false;

/** 商品及职业列表
 ***************/
// 加商品和职业可以很方便地在这里加
const marketList = { // 可分期商品列表（目前包括 载具 和 地产）
    'buy-mini-truck': {price:genPrice(7190,10700,10), dividedMonth:12, step:10},
    'buy-semi-truck': {price:genPrice(138500,183500,100), dividedMonth:24, step:50},
    'buy-excavator': {price:genPrice(40000,61000,50), dividedMonth:12, step:50},

    'buy-warehouse': {price:genPrice(3000,5000,50), dividedMonth:3, step:100}
}
for (let id in marketList) {
    item = marketList[id];
    item.dividedPrice = genDividedPrice(item.price,1.1,item.dividedMonth,item.step)
}
//示例：{id:'buy-mini-truck', price:3500, dividedPrice:640, dividedMonth:6, step:10},
const shopList = { // 不可分期商品列表
    'buy-health-elixir': {price:50},
}
const employList = { // 雇员列表
    'employ-zombie': {salary:3000},
    'employ-vampire': {salary:7500}
}
let dividedBuyList = {};
//示例dividedBuyList:{ 'property-name': {icon:'🎈', dividedPrice:10, dividedMonth:6, payCountDown:30} }
let propertyList = {};
//示例propertyList:{ 'property-name': {amount:1, amountUsed:0, maintainStatus:5, maintainDecrChance:0.5} }
let employeeList = {};
//示例employeeList:{ employee-name': {amount:1, amountWorking:0, maintainStatus:5, maintainDecrChance:0.5} }
let employeeGStack = []; // F 代表女，M 代表男
let resourceList = {
    'transport': {produce: 0, consume: 0, stock: 0, price: 0.5},
    'construct': {produce: 0, consume: 0, stock: 0, price: 1.5},
    'gear': {produce: 0, consume: 0, stock: 0, price: 0.56},
    'nut-bolt': {produce: 0, consume: 0, stock: 0, price: 0.16},
    'steel': {produce: 0, consume: 0, stock: 0, price: 0.37}
};
let selfResourceList = {
    'transport': {produce:0},
    'construct': {produce:0}
};

/**根据资产更新资源产出和收入
 * 需要变量：
 *      workingProperty
 *      selfResourceList（必须先处理，因为后续更新estiIncomePerH需要）
 *      workStat
 *      resourceList
 * 更新变量：
 *      actuIncomePerH
 *      estiIncomePerH
 */
function updateResource() {
    actuIncomePerH = 0;
    estiIncomePerH = 0;
    const produceAddMapping = {
        'transport': {
            'semi-truck': 85,
            'mini-truck': 45,
            'excavator': 0,
            'default': 25
        },
        'construct': {
            'excavator': 15,
            'default': 0
        }
    };
    const produceMultMapping = {
        'transport': {
            'warehouse': 5,
            'default': 0
        }
    };
    // 帮助函数，根据 资源类型 和 资产，决定这个资源类型的产量
    const getProduceValue = (resourceType, propertyName) => { 
        if (produceAddMapping[resourceType] && produceAddMapping[resourceType][propertyName] !== undefined ) {
            return produceAddMapping[resourceType][propertyName];
        }
        return produceAddMapping[resourceType] ? produceAddMapping[resourceType]['default'] : 0;
    };
    const getProduceMultipe = (resourceType, propertyName) => { 
        if (produceMultMapping[resourceType] && produceMultMapping[resourceType][propertyName] !== undefined ) {
            return produceMultMapping[resourceType][propertyName];
        }
        return produceMultMapping[resourceType] ? produceMultMapping[resourceType]['default'] : 0;
    };
    // 根据当前工作使用的资产处理小人自己的资源产出
    for (let id in selfResourceList) {
        selfResourceList[id].produce = getProduceValue(id, workingProperty);
    }
    for (let id in resourceList) {
        resourceList[id].produce = 0;
        // 点击生产的资源
        if (selfResourceList[id] !== undefined) {
            resourceList[id].produce += selfResourceList[id].produce * workStat; // workStat 0 代表不上班，1代表上班
            priceMulti = selfResourceList[id].produce < 0 ? 1.2 : 1.0; // priceMulti 价格乘数 1.2是买时的价格，1.0是卖时的价格
            estiIncomePerH += selfResourceList[id].produce * resourceList[id].price * priceMulti;
        }
        // 自动生产的资源
        propertyMultProduce = 0;
        for (propId in propertyList) {
            // console.log(propertyList[propId])
            propertyUsed = propertyList[propId].amountUsed;
            propertyAmount = propertyList[propId].amount;
            propertyAddProduce = getProduceValue(id, propId); // 数值加成
            propertyMultProduce += getProduceMultipe(id, propId) * propertyAmount; // 百分比加成
            if (propId === workingProperty) {// 减去小人自己使用的资产
                propertyUsed--;
            }
            resourceList[id].produce += propertyAddProduce*propertyUsed
        }
        resourceList[id].produce *= (1 + propertyMultProduce/100); // 对资源产量进行百分比加成
        // console.log(propertyUsed)
        // 计算总资源
        netProduct = resourceList[id].produce - resourceList[id].consume;
        priceMulti = netProduct < 0 ? 1.2 : 1; // priceMulti 价格乘数 1.2是买时的价格，1.0是卖时的价格
        actuIncomePerH += (netProduct * resourceList[id].price * priceMulti); // 此处已将点击生产和自动生产的资源都计入
    }
}
/**根据资产更新职业
 * 需要变量：
 *      workingProperty
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
        case 'excavator':
            currentJobText = '挖掘机操作员';
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
    $('#coin-count').text( `${coinCount.toFixed(2).toLocaleString()} $` );
    $('#coins-per-click').text( `${estiIncomePerH.toLocaleString()} $` );
    $('#goal-remain').text( `${(goal - coinCount)>0 ? (goal - coinCount).toLocaleString() : 0} $` );
    $('#current-date').text( `${currDate.getFullYear()}年${(currDate.getMonth()+1)}月${currDate.getDate()}日${currDate.getHours()}点` );
    $('#health').text( Math.round(health*100)/100 ); // 避免 1.099999999 这样的数字出现

    /**健康值相关的图标跟新
     * 需要变量：
     *      health
     * HTML更新：
     */
    let selfElement = $("#self");
    let medicinElement = $('#buy-health-elixir');
    if (health >= 0) {
        medicinElement.addClass('hidden');
        selfElement.html( selfElement.html().replace('🚑', GIcon[GIdx]) );
    } else {
        medicinElement.removeClass('hidden');
        selfElement.html( selfElement.html().replace(GIcon[GIdx], '🚑') );
    }

    /**根据资产列表以及分期付款列表，更新分期付款文本的剩余分期月、剩余还款倒计时天数等
     * 需要变量：
     *      propertyList
     *      dividedBuyList
     * HTML更新：
     */
    for (let id in propertyList) {
        // 分期付款期间 以及 偿清贷款 的情况
        dividedBuyItem = dividedBuyList[id];
        if ( dividedBuyItem !== undefined ) { // 已有分期付款，只需更新数字
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = $(`#${id} .divided-month`);
            currDividedMonth.text( currDividedMonth.text().replace(/\d+/, dividedBuyItem.dividedMonth) );
            currPayCountDown = $(`#${id} .pay-count-down`);
            currPayCountDown.text( currPayCountDown.text().replace(/\d+/, dividedBuyItem.payCountDown) );
        } else if ( $(`#${id}:has(.divided-month)`).length > 0 ) { // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
            $(`#${id} .divided-month`).html( '' );
            $(`#${id} .pay-count-down`).html( '' );
        } // 到期不还款的情况在 updateDividedPay()

        // 更新劳动力分配面板
        $(`#${id} .work-force-limit`).text( propertyList[id].amount );
        $(`#${id} .work-force-input`).text( propertyList[id].amountUsed );

    }


    // 更新商店按钮
    for (let id in marketList) {
        shopButton = $('button#'+id);
        if (!dividePay) {
            shopButton.html( shopButton.html().replace('分期买', '购买') );
        } else {
            shopButton.html( shopButton.html().replace('购买', '分期买') );
        }
    }

    // 根据资产更新职业
    updateDisplayJob();

    /**更新资源列表的产量、收入等数字
     * 需要变量：
     *      resourceList
     * HTML更新：
     */
    for (let id in resourceList) {
        tableRow = $(`#${id}`);
        tableRow.find(".net-produce .num").html( (resourceList[id].produce - resourceList[id].consume).toFixed(2) );
        tableRow.find(".net-produce .produce").html( resourceList[id].produce.toFixed(2) );
        tableRow.find(".net-produce .consume").html( resourceList[id].consume.toFixed(2) );
        netProduct = resourceList[id].produce - resourceList[id].consume;
        priceMulti = netProduct < 0 ? 1.2 : 1;
        tableRow.find(".income .num").html( (netProduct*resourceList[id].price*priceMulti).toFixed(2) );
        tableRow.find(".income .price").html( netProduct < 0 ? -(resourceList[id].price*priceMulti).toFixed(2).toLocaleString() : resourceList[id].price.toFixed(2).toLocaleString() );
    }
}

function genPrice(min, max, step) {
    const range = Math.floor((max - min) / step) + 1;
    const randomStep = Math.floor(Math.random() * range);
    return min + (randomStep * step);
}
function genDividedPrice(value, multiplier, divisor, step) {
    const dividedValue = value * multiplier / divisor;
    const roundedValue = Math.round(dividedValue / step) * step;
    return roundedValue;
}