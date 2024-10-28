console.log('02-加载preset.js')

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
gameData.workingProperty = 'NONE'
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

/** 商品及职业列表
 ***************/
// 加商品和职业可以很方便地在这里加

 // 可分期商品列表（目前包括 载具 和 地产）
const marketList = { //【添加】【新资产】
    'buy-tuk-tuk': { price: genPrice(800, 1200, 1), installMonth: 3 },
    'buy-mini-truck': { price: genPrice(7190, 10700, 5), installMonth: 12 },
    'buy-semi-truck': { price: genPrice(138500, 183500, 10), installMonth: 24 },
    'buy-excavator': { price: genPrice(40000, 61000, 10), installMonth: 12 },
    'buy-mini-bus': { price: genPrice(50000, 73000, 5), installMonth: 12 },
    'buy-bus': { price: genPrice(129995, 164995, 5), installMonth: 24 },

    'buy-warehouse': { price: genPrice(3000, 5000, 50), installMonth: 3 },
    'buy-office': { price: genPrice(6000, 10000, 50), installMonth: 6 },
    'buy-store': { price: genPrice(20000, 34500, 50), installMonth: 6 },
}
 // 价格倍数
const marketStep = { //【添加】【新资产】
    'buy-tuk-tuk': { step: 1 },
    'buy-mini-truck': { step: 5 },
    'buy-semi-truck': { step: 10 },
    'buy-excavator': { step: 10 },
    'buy-mini-bus': { step: 5 },
    'buy-bus': { step: 5 },

    'buy-warehouse': { step: 50 },
    'buy-office': { step: 50 },
    'buy-store': { step: 50 },
}
for (let id in marketList) {
    item = marketList[id];
    item.installPrice = genDividedPrice(item.price, 1.1, item.installMonth, marketStep[id].step)
}
//示例：{id:'buy-mini-truck', price:3500, installPrice:640, installMonth:6},
const shopList = { // 不可分期商品列表
    'buy-health-elixir': { price: 149.99 },
    'buy-laptop': { price: 259.99 }, // 买了之后解锁产出管理力的能力
    'buy-television': { price: 799.99 },
    'buy-alarm-clock': { price: 33.40 },
    'buy-sleeping-pill': { price: 41.13 },
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
gameData.employeeGStack = {}; // F 代表女，M 代表男
let initialResourceList = { //【添加】【新资源】
    'transport': { produce: 0, consume: 0, stock: 0, price: 0.5, buy: 1.5 },
    'service': { produce: 0, consume: 0, stock: 0, price: 3.0, buy: 1.5 },
    'construct': { produce: 0, consume: 0, stock: 0, price: 4.5, buy: 1.5 },
    'manage': { produce: 0, consume: 0, stock: 0, price: 5.0, buy: 3.0 },
    'gear': { produce: 0, consume: 0, stock: 0, price: 0.56, buy: 1.2 },
    'nut-bolt': { produce: 0, consume: 0, stock: 0, price: 0.16, buy: 1.2 },
    'snack': { produce: 0, consume: 0, stock: 0, price: 4.5, buy: 1.5 },
    'retail': { produce: 0, consume: 0, stock: 0, price: 9.9, buy: 1.5 },
};
gameData.resourceList = initialResourceList;
let initialSelfResourceList = { //【添加】【新资源】
    'transport': { produce: 0, consume: 0 },
    'service': { produce: 0, consume: 0 },
    'construct': { produce: 0, consume: 0 },
    'manage': { produce: 0, consume: 0 },
    'snack': { produce: 0, consume: 0 },
    'retail': { produce: 0, consume: 0 },
};
gameData.selfResourceList = initialSelfResourceList;

// console.log(gameData.selfResourceList)

// 各种资源可由何种资产产出，每个资产产出多少（在有劳动力工作的前提下）
const produceAddMapping = { //【添加】【新资源】【添加】【新资产】
    'transport': {
        'semi-truck': 85,
        'mini-truck': 45,
        'warehouse': 25,
        'NONE': 25, // 仅个人使用
        'tuk-tuk': 10,
        'mini-bus': 25,
        'default': 0,
    },
    'construct': {
        'excavator': 5,
        'default': 0
    },
    'manage': {
        'office': 4,
        'laptop': 3, // 仅个人使用
        'default': 0
    },
    'service': {
        'mini-bus': 8,
        'tuk-tuk': 3,
        'bus': 24,
        'default': 0,
    },
    'snack': {
        'default': 0,
    },
    'retail': {
        'store': 20,
        'default': 0,
    },
};
// 每个资产消耗多少资源（在有劳动力工作的前提下）
const consumeAddMapping = { //【添加】【新资产】【添加】【新资源】
    'transport': {
        'store': 25,
        'default': 0,
    },
    'snack': {
        'store': 25,
        'default': 0,
    },
    'manage': { // 共用这个const
        'zombie': 0.5,
        'vampire': 1.0,
        'default': 0
    },
}
const consumePasiveAddMapping = { //【添加】【新资产】【添加】【新资源】
    'gear': {
        'tuk-tuk': 0.01,
        'semi-truck': 0.04,
        'mini-truck': 0.02,
        'excavator': 0.05,
        'mini-bus': 0.05,
        'bus': 0.05,
        'default': 0
    },
    'nut-bolt': {
        'tuk-tuk': 0.1,
        'semi-truck': 0.8,
        'mini-truck': 0.4,
        'excavator': 1.0,
        'mini-bus': 0.6,
        'bus': 0.8,
        'default': 0
    },
    'construct': {
        'warehouse': 0.2,
        'office': 0.1,
        'store': 0.2,
        'default': 0
    },
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
            // console.log(mapping[resourceType][propertyName])
            return mapping[resourceType][propertyName];
        }
        return mapping[resourceType] ? mapping[resourceType]['default'] : 0;
    };

    // 根据当前工作使用的资产处理小人自己的资源产出
    for (let id in gameData.selfResourceList) {
        // console.log(id + " - " + gameData.selfResourceList[id].produce)
        gameData.selfResourceList[id].produce = getValueByPropertyName(produceAddMapping, id, gameData.workingProperty);
        gameData.selfResourceList[id].consume = getValueByPropertyName(consumeAddMapping, id, gameData.workingProperty);
        // console.log(id + " - " + gameData.selfResourceList[id].produce)
    }
    for (let id in gameData.resourceList) {
        let resource = gameData.resourceList[id];
        resource.produce = 0;
        resource.consume = 0;

        /** 点击生产的资源 **/ 
        if (gameData.selfResourceList[id] !== undefined) {
            let selfResource = gameData.selfResourceList[id];
            resource.produce += selfResource.produce * gameData.workStat; // 根据工作状态调整产量
            resource.consume += selfResource.consume * gameData.workStat; // 根据工作状态调整产量

            let selfNetProduct = selfResource.produce - selfResource.consume;
            let priceMultiplier = selfNetProduct < 0 ? resource.buy : 1.0; // 根据生产/消耗决定价格乘数
            estiIncomePerH += selfNetProduct * resource.price * priceMultiplier;
        }
        
        /** 被动生产&消耗的资源 **/
        let propertyMultProduce = 0;
        for (propId in gameData.propertyList) {
            // console.log(gameData.propertyList[propId])
            let property = gameData.propertyList[propId];
            let propertyUsed = property.amountUsed;
            let propertyAmount = property.amount;

            let propertyAddProduce = getValueByPropertyName(produceAddMapping, id, propId); // 数值加成
            let propertyAddConsume = getValueByPropertyName(consumePasiveAddMapping, id, propId); // 数值消耗
            propertyMultProduce += getValueByPropertyName(produceMultMapping, id, propId) * propertyAmount; // 百分比加成

            resource.consume += propertyAddConsume * propertyUsed; // 此处故意不减去小人自己使用的资产

            if (propId === gameData.workingProperty) propertyUsed--; // 减去小人自己使用的资产

            resource.produce += propertyAddProduce * propertyUsed;
        }
        resource.produce *= (1 + propertyMultProduce / 100); // 对资源产量进行百分比加成
        
        /** 劳动力所消耗的管理力资源 **/ 
        for (empId in gameData.employeeList) {
            let employee = gameData.employeeList[empId];
            let employeeAddConsume = getValueByPropertyName(consumeAddMapping, id, empId); // 数值消耗
            resource.consume += employeeAddConsume * employee.amountWorking;
        }
        
        // console.log(propertyUsed)
        // 计算总资源
        let netProduct = resource.produce - resource.consume;
        let priceMultiplier = netProduct < 0 ? resource.buy : 1.0;
        actuIncomePerH += (netProduct * resource.price * priceMultiplier); // 此处已将点击生产和自动生产的资源都计入
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
        case 'office':
            currentJobKey = "click-job-office-clerk";
            break;
        case 'store':
            currentJobKey = "click-job-store-worker";
            break;
        case 'NONE':
        default:
            currentJobKey = "click-job-porter";
            break;
    }
    $('#current-job').attr("i18n-key", currentJobKey);
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

// 在shop和build中使用的函数，给propertyList添加东西用
function addToPropertyList(id) {
    propertyItem = gameData.propertyList[id];
    if ( propertyItem !== undefined ) {// 已有这个商品
        propertyItem.amount++;
    } else { // 没有这个商品，创建这个商品
        gameData.propertyList[id] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
    }
}

// 压缩和解压图标的函数
function countToIconStr(count, icon) {
    let units = [500, 100, 50, 10];
    let result = '';
    let remaining = count;
    // Go through each unit (100, 50, 10, 5) to form the string
    for (let unit of units) {
        let num = Math.floor(remaining / unit);
        if (num > 0) {
            result += `[${icon}×${unit}] `.repeat(num);
            remaining %= unit;
        }
    }

    // Add the remaining emojis (1s)
    if (remaining > 0) {
        result += icon.repeat(remaining);
    }

    return result.trim();
}
function countToIconStrGender(count, iconAry, genderStack) { 
    // console.log("countToIconStrGender运行")
    let units = [500, 100, 50, 10];
    let result = '';
    let remaining = count;
    for (let unit of units) {
        let num = Math.floor(remaining / unit);
        if (num > 0) {
            for (let i = 0; i < num; i++) {
                // Determine the first gender in the current unit
                let firstGender = genderStack[0];
                let genderIcon = firstGender === 'F' ? iconAry[0] : iconAry[1];

                // Add the unit representation to the result
                result += `[${genderIcon}×${unit}] `;
                
                // Remove the processed part of genderStack
                genderStack = genderStack.slice(unit);
            }
            remaining %= unit;
        }
    }

    if (remaining > 0) {
        let remainingIcons = genderStack.slice(0, remaining).map(gender => gender === 'F' ? iconAry[0] : iconAry[1]).join('');
        result += remainingIcons;
    }
    return result.trim();
}
// 方便修改数据的函数
function updateIconStore(containerId) {
    gameData.iconStore[`#${containerId} .icon`] = $(`#${containerId} .icon`).html();
}
function addToShowingList(selector) {
    $(selector).removeClass("hidden");
    gameData.removeHidden[selector] = 1;
}
function deleteFromShowingList(selector) {
    $(selector).addClass('hidden');
    // console.log(selector+"已添加class hidden")
    delete gameData.removeHidden[selector];
}
