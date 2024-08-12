console.log('preset.js')

/* 存储所有游戏数据的变量 */
// 实在想不到还有什么别的方法可以快速实现存储数据了
let gameData = {}

// 最基础的数据
gameData.coinCount = 0;
let actuIncomePerH = 0;

// 人物相关数据
gameData.health = 100.00;
gameData.effectList = []
gameData.workStat = 0; // 上班与否标记，用在资源列表更新中，0代表不上班1代表上班，以后可能会改一个方式
let estiIncomePerH = 12.5;
gameData.workingProperty = ''
gameData.GIdx = 0
const GIcon = ['🧍', '🧍‍♂️', '🧍‍♀️']
const GTxt = ['?', '♂', '♀']

// 游戏机制数据
gameData.goal = 1000000;
let dateArray = [1000, 0, 1, 9]
gameData.currDate = new Date(...dateArray);
gameData.gameFinished = false;
let currentTimer;
let gamePaused = true;
gameData.installPay = false;
gameData.removeHidden = {};
gameData.iconStore = {};
gameData.disabledButton = {};

// 翻译
let translations = {};

/** 商品及职业列表
 ***************/
// 加商品和职业可以很方便地在这里加
const marketList = { // 可分期商品列表（目前包括 载具 和 地产）
    'buy-mini-truck': { price: genPrice(7190, 10700, 10), installMonth: 12 },
    'buy-semi-truck': { price: genPrice(138500, 183500, 100), installMonth: 24 },
    'buy-excavator': { price: genPrice(40000, 61000, 50), installMonth: 12 },

    'buy-warehouse': { price: genPrice(3000, 5000, 50), installMonth: 3 },
}
const marketStep = { // 价格倍数
    'buy-mini-truck': { step: 10 },
    'buy-semi-truck': { step: 50 },
    'buy-excavator': { step: 50 },

    'buy-warehouse': { step: 100 },
}
for (let id in marketList) {
    item = marketList[id];
    item.installPrice = genDividedPrice(item.price, 1.1, item.installMonth, marketStep[id])
}
//示例：{id:'buy-mini-truck', price:3500, installPrice:640, installMonth:6, step:10},
const buildList = {
    'build-office': { buildOn: 'warehouse', constructInput: [6, 15], constructTotal: 400 }
}
const shopList = { // 不可分期商品列表
    'buy-health-elixir': { price: 149.99 },
    'buy-laptop': { price: 259.99 }, // 买了之后解锁产出管理力的能力
}
const employList = { // 雇员列表
    'employ-zombie': { salary: 3000 },
    'employ-vampire': { salary: 7500 }
}
gameData.installmentList = {}; // 记录分期付款信息，注：正在分期付款时视为拥有
//示例installmentList:{ 'property-name': {icon:'🎈', installPrice:10, installMonth:6, payCountDown:30} }
gameData.propertyList = {};
//示例propertyList:{ 'property-name': {amount:1, amountUsed:0, maintainStatus:5, maintainDecrChance:0.5} }
gameData.employeeList = {};
//示例employeeList:{ employee-name': {amount:1, amountWorking:0, maintainStatus:5, maintainDecrChance:0.5} }
gameData.constructList = {}; // 记录建造信息，注：正在建造时 不视为拥有
//示例constructList:{ 'building-name': {icon:'🎈', installPrice:10, installMonth:6, payCountDown:30} }
gameData.employeeGStack = {}; // F 代表女，M 代表男
let initialResourceList = {
    'transport': { produce: 0, consume: 0, stock: 0, price: 0.5, buy: 1.5 },
    'construct': { produce: 0, consume: 0, stock: 0, price: 4.5, buy: 1.5 },
    'manage': { produce: 0, consume: 0, stock: 0, price: 7.5, buy: 2.0 },
    'gear': { produce: 0, consume: 0, stock: 0, price: 0.56, buy: 1.2 },
    'nut-bolt': { produce: 0, consume: 0, stock: 0, price: 0.16, buy: 1.2 },
    'steel': { produce: 0, consume: 0, stock: 0, price: 0.37, buy: 1.2 },
};
gameData.resourceList = initialResourceList;
let initialSelfResourceList = {
    'transport': { produce: 0 },
    'construct': { produce: 0 },
    'manage': { produce: 0 },
};
gameData.selfResourceList = initialSelfResourceList;

const produceAddMapping = { // 各种资源可由何种资产产出，每个资产产出多少（在有劳动力工作的前提下）
    'transport': {
        'semi-truck': 85,
        'mini-truck': 45,
        'excavator': 0,
        'warehouse': 25,
        'laptop': 0, // 仅个人使用
        'default': 25
    },
    'construct': {
        'excavator': 5,
        'default': 0
    },
    'manage': {
        'office': 4,
        'laptop': 3, // 仅个人使用
        'default': 0
    }
};
const consumeAddMapping = {
    'gear': {
        'semi-truck': 0.02,
        'mini-truck': 0.04,
        'excavator': 0.05,
        'default': 0
    },
    'nut-bolt': {
        'semi-truck': 0.4,
        'mini-truck': 0.8,
        'excavator': 1.0,
        'default': 0
    },
    'manage': { // 共用这个const
        'zombie': 0.5,
        'vampire': 1.0,
        'default': 0
    }
}
const produceMultMapping = {
    'transport': {
        'warehouse': 5,
        'default': 0
    }
};

/**根据资产更新资源产出和收入
 * 需要变量：
 *      gameData.workingProperty
 *      gameData.selfResourceList（必须先处理，因为后续更新estiIncomePerH需要）
 *      gameData.
 *      gameData.resourceList
 * 更新变量：
 *      actuIncomePerH
 *      estiIncomePerH
 */
function updateResource() {
    actuIncomePerH = 0;
    estiIncomePerH = 0;

    // 帮助函数，根据 资源类型 和 资产，决定这个资源类型的产量
    const getValueByPropertyName = (mapping, resourceType, propertyName) => {
        if (mapping[resourceType] && mapping[resourceType][propertyName] !== undefined) {
            return mapping[resourceType][propertyName];
        }
        return mapping[resourceType] ? mapping[resourceType]['default'] : 0;
    };

    // 根据当前工作使用的资产处理小人自己的资源产出
    for (let id in gameData.selfResourceList) {
        gameData.selfResourceList[id].produce = getValueByPropertyName(produceAddMapping, id, gameData.workingProperty);
    }
    for (let id in gameData.resourceList) {
        gameData.resourceList[id].produce = 0;
        gameData.resourceList[id].consume = 0;

        // 点击生产的资源
        if (gameData.selfResourceList[id] !== undefined) {
            gameData.resourceList[id].produce += gameData.selfResourceList[id].produce * gameData.workStat; // gameData.workStat 0 代表不上班，1代表上班
            priceMulti = gameData.selfResourceList[id].produce < 0 ? gameData.resourceList[id].buy : 1.0; // priceMulti 价格乘数 buy是买时的价格，1.0是卖时的价格
            estiIncomePerH += gameData.selfResourceList[id].produce * gameData.resourceList[id].price * priceMulti;
        }
        
        // 自动生产的资源
        propertyMultProduce = 0;
        for (propId in gameData.propertyList) {
            // console.log(gameData.propertyList[propId])
            propertyUsed = gameData.propertyList[propId].amountUsed;
            propertyAmount = gameData.propertyList[propId].amount;
            propertyAddProduce = getValueByPropertyName(produceAddMapping, id, propId); // 数值加成
            propertyAddConsume = getValueByPropertyName(consumeAddMapping, id, propId); // 数值消耗
            propertyMultProduce += getValueByPropertyName(produceMultMapping, id, propId) * propertyAmount; // 百分比加成

            gameData.resourceList[id].consume += propertyAddConsume * propertyUsed // 此处故意不减去小人自己使用的资产
            if (propId === gameData.workingProperty) {// 减去小人自己使用的资产
                propertyUsed--;
            }
            gameData.resourceList[id].produce += propertyAddProduce * propertyUsed
        }
        gameData.resourceList[id].produce *= (1 + propertyMultProduce / 100); // 对资源产量进行百分比加成
        // 劳动力所消耗的管理力
        for (empId in gameData.employeeList) {
            employeeWorking = gameData.employeeList[empId].amountWorking;
            employeeAddConsume = getValueByPropertyName(consumeAddMapping, id, empId); // 数值消耗
            gameData.resourceList[id].consume += employeeAddConsume * employeeWorking
        }
        // console.log(propertyUsed)
        // 计算总资源
        netProduct = gameData.resourceList[id].produce - gameData.resourceList[id].consume;
        priceMulti = netProduct < 0 ? gameData.resourceList[id].buy : 1.0; // priceMulti 价格乘数 buy是买时的价格，1.0是卖时的价格
        actuIncomePerH += (netProduct * gameData.resourceList[id].price * priceMulti); // 此处已将点击生产和自动生产的资源都计入
    }
}
/**根据资产更新职业
 * 需要变量：
 *      gameData.workingProperty
 * HTML更新
 */
function updateDisplayJob() {
    var currentJobKey = '';
    switch (gameData.workingProperty) {
        case 'semi-truck':
            currentJobKey = "click-job-semi-truck-driver";
            break;
        case 'mini-truck':
            currentJobKey = "click-job-mini-truck-driver";
            break;
        case 'excavator':
            currentJobKey = "click-job-excavator-operator";
            break;
        case 'laptop':
            currentJobKey = "click-job-self-employ-manager";
            break;
        default:
            currentJobKey = "click-job-porter";
            break;
    }
    $('#current-job').attr("i18n-key", currentJobKey);
}

/** 更新显示（不是所有显示都在此更新）
 *********************************/
function updateDisplay() {
    // 基本文本更新
    $('#coin-count').text(`${gameData.coinCount.toFixed(2).toLocaleString()} $`);
    $('#coin-per-hour').text(`${actuIncomePerH.toFixed(2).toLocaleString()} $`);
    $('#coins-per-click').text(`${estiIncomePerH.toLocaleString()} $`);
    $('#goal-remain').text(`${(gameData.goal - gameData.coinCount) > 0 ? parseFloat((gameData.goal - gameData.coinCount).toFixed(2)).toLocaleString() : 0} $`);
    $('#current-date').html(`${gameData.currDate.getFullYear()}-${(gameData.currDate.getMonth() + 1).toString().padStart(2, '0')}-${gameData.currDate.getDate().toString().padStart(2, '0')};  ${genClockIcon(gameData.currDate.getHours())}${gameData.currDate.getHours()}<span i18n-key="o-clock"></span>`);
    $('#health').text(Math.round(gameData.health * 100) / 100); // 避免 1.099999999 这样的数字出现

    /**健康值相关的图标跟新
     * 需要变量：
     *      gameData.health
     * HTML更新：
     */
    let selfElement = $("#self .icon");
    let medicinElement = $('#buy-health-elixir');
    if (gameData.health >= 0) {
        medicinElement.addClass('hidden');
        delete gameData.removeHidden["#buy-health-elixir"];
        if (gameData.currDate.getHours() < 9 && gameData.workStat == 0) { // 0-8点
            selfElement.html('🛌');
        } else if (gameData.currDate.getHours() > 16 && gameData.workStat == 0) { // 17-23点
            selfElement.html('🛀');
        } else {
            selfElement.html(GIcon[gameData.GIdx]);
        }
    } else {
        medicinElement.removeClass('hidden');
        gameData.removeHidden["#buy-health-elixir"] = 1;
        selfElement.html('🚑');
    }

    /**根据资产列表以及分期付款列表，更新分期付款文本的剩余分期月、剩余还款倒计时天数等
     * 需要变量：
     *      gameData.propertyList
     *      gameData.installmentList
     * HTML更新：
     */
    for (let id in gameData.propertyList) {
        // 分期付款期间 以及 偿清贷款 的情况
        installmentItem = gameData.installmentList[id];
        if (installmentItem !== undefined) { // 已有分期付款，只需更新数字
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = $(`#${id} .install-month`);
            currDividedMonth.text(installmentItem.installMonth);
            currPayCountDown = $(`#${id} .pay-count-down`);
            currPayCountDown.text(installmentItem.payCountDown);
        } else if ($(`#${id}:has(.install-month)`).length > 0) { // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
            $(`#install-${id}`).addClass('hidden')
            delete gameData.removeHidden[`#install-${id}`];
        } // 到期不还款的情况在 updateInstallment()

        // 更新劳动力分配面板
        $(`#${id} .work-force-limit`).text(gameData.propertyList[id].amount);
        $(`#${id} .work-force-input`).text(gameData.propertyList[id].amountUsed);
        // console.log(gameData.propertyList[id].amountUsed)
    }


    // 更新商店按钮

    installTag = $('.buy-or-install');
    if (!gameData.installPay) {
        installTag.attr('i18n-key', 'mkt-buy');
    } else {
        installTag.attr('i18n-key', 'mkt-install');
    }

    // 根据资产更新职业
    updateDisplayJob();

    /**更新资源列表的产量、收入等数字
     * 需要变量：
     *      gameData.resourceList
     * HTML更新：
     */
    for (let id in gameData.resourceList) {
        tableRow = $(`#${id}`);
        tableRow.find(".net-produce .num").html((gameData.resourceList[id].produce - gameData.resourceList[id].consume).toFixed(2));
        tableRow.find(".net-produce .produce").html(gameData.resourceList[id].produce.toFixed(2));
        tableRow.find(".net-produce .consume").html(gameData.resourceList[id].consume.toFixed(2));
        netProduct = gameData.resourceList[id].produce - gameData.resourceList[id].consume;
        priceMulti = netProduct < 0 ? gameData.resourceList[id].buy : 1;
        tableRow.find(".income .num").html((netProduct * gameData.resourceList[id].price * priceMulti).toFixed(2));
        tableRow.find(".income .price").html(netProduct < 0 ? -(gameData.resourceList[id].price * priceMulti).toFixed(2).toLocaleString() : gameData.resourceList[id].price.toFixed(2).toLocaleString());
    }

    $("[i18n-key]").each(translateElement); // 更新文本翻译
}

function genClockIcon(time) {
    time = time % 12;
    switch (time) {
        case 1:
            return '🕐';
        case 2:
            return '🕑';
        case 3:
            return '🕒';
        case 4:
            return '🕓';
        case 5:
            return '🕔';
        case 6:
            return '🕕';
        case 7:
            return '🕖';
        case 8:
            return '🕗';
        case 9:
            return '🕘';
        case 10:
            return '🕙';
        case 11:
            return '🕚';
        case 0:
            return '🕛';
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