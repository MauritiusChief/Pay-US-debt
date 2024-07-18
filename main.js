let coinCount = 0;
let coinsPerClick = 12.5;

let autoClickerEarn = 1;
let goal = 10;
let dateArray = [1000, 0, 1, 8]
let currDate = new Date(...dateArray);
let gameFinished = false;
let currentTimer;

/** 商品及职业列表 */
const shopList = [
    {id:'buy-mini-truck', price:3500, dividedPrice:320, dividedMonth:12}
]
let dividedBuyList = [];
let propertyList = [];

// 根据资产更新职业
function updateJobIncom() {
    if (propertyList.includes('mini-truck')) {
        coinsPerClick = 23.5;
    } else {
        coinsPerClick = 12.5;
    }
}

// 根据资产更新职业
function updateDisplayJob() {
    if (propertyList.includes('mini-truck')) {
    document.getElementById('current-job').textContent = '小货车司机';
} else {
    document.getElementById('current-job').textContent = '搬运工';
}
}


// 初始执行函数
// alert("你是一个正直的美国公民，被奸人诬陷投入此赛博牢狱，你需要还清所有美国国债来重获自由。点击按钮挣取美刀。")
updateShop();

// Fetch the current national debt
fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[number]=1&page[size]=1')
.then(response => response.json())
.then(data => {
    const totalDebt = data.data[0].tot_pub_debt_out_amt;
    const acquireDate = data.data[0].record_date
    goal = parseFloat(totalDebt);
    document.getElementById('goal').textContent = goal.toLocaleString() + " $";
    document.getElementById('goal-remain').textContent = (goal - coinCount).toLocaleString() + " $";
    document.getElementById('goal-date').textContent = acquireDate;
    let acquireDateArray = acquireDate.split("-");
    dateArray.splice(0, 3, ...acquireDateArray);
    document.getElementById('current-date').textContent = `${dateArray[0]}年${dateArray[1].replace(0,'')}月${dateArray[2].replace(0,'')}日${dateArray[3]}点`;
    dateArray[1]--;
    currDate = new Date(...dateArray);
})
.catch(error => {
    console.error('获取美债数据出错:', error);
    document.getElementById('goal').textContent = '数据获取失败';
    document.getElementById('goal-date').textContent = '数据获取失败';
});

/** 游戏机制 */
function everyHourEvent() {
    incrementTime();
    // 消除（加班中）标记
    document.getElementById('overtime').textContent = '';
    // 小人图标
    document.querySelectorAll("[type=person]").forEach(personTag => {
        if (currDate.getHours() < 9 ) { // 0-9点
            personTag.innerHTML = personTag.innerHTML.replace('🧍‍♂️','🛌');
            personTag.innerHTML = personTag.innerHTML.replace('🛀','🛌');
        } else if (currDate.getHours() > 17) { // 18-23点
            personTag.innerHTML = personTag.innerHTML.replace('🧍‍♂️','🛀');
        } else {
            personTag.innerHTML = personTag.innerHTML.replace('🛌','🧍‍♂️');
        }
    })
    updateShop();
    updateDisplay();

    // console.log(propertyList)
    // console.log(dividedBuyList)
}

// 步进时间，同时每天10点触发每日事件
function incrementTime() {
    currDate.setHours(currDate.getHours() + 1);
    switch (currDate.getHours()) {
        case 17:
        case 6:
            document.body.classList.remove("dark-mode");
            document.body.classList.add("dawn-mode");
            break;
        case 0:
            document.body.classList.remove("dawn-mode");
            document.body.classList.add("dark-mode");
            break;
        case 9:
            document.body.classList.remove("dawn-mode");
            break;
        default:
            break;
    }
    if (currDate.getHours() === 10) {
        everyDayEvent();
    }

    checkGoal()
}

// 每日事件
function everyDayEvent() {
    updateDividedPay()
}

// 点击挣钱按钮
document.getElementById('click-button').addEventListener('click', () => {
    // 更新时薪数据
    // 根据资产更新职业
    updateJobIncom();
    coinCount += coinsPerClick;
    incrementTime();
    // 加班标识
    if (currDate.getHours() < 9 || currDate.getHours() > 17) {
        let selfElement = document.getElementById("self");
        selfElement.innerHTML = selfElement.innerHTML.replace('🛌', '🧍‍♂️');
        selfElement.innerHTML = selfElement.innerHTML.replace('🛀', '🧍‍♂️');
        if (!document.getElementById('overtime').textContent.includes("（加班中）")) {
            document.getElementById('overtime').textContent = "（加班中）";
        }
    }
    
    // 每次点击则重置计时，避免时间跳动
    clearInterval(currentTimer);
    currentTimer = setInterval(everyHourEvent, 1000);
    
    updateShop();
    updateDisplay();
});

document.getElementById('game-pause').addEventListener('click', () => {
    clearInterval(currentTimer);
})

// 更新显示（不是所有显示都在此更新）
function updateDisplay() {
    document.getElementById('coin-count').textContent = `${coinCount.toLocaleString()} $`;
    document.getElementById('coins-per-click').textContent = `${coinsPerClick.toLocaleString()} $`;
    document.getElementById('goal-remain').textContent = `${(goal - coinCount)>0 ? (goal - coinCount).toLocaleString() : 0} $`;
    document.getElementById('current-date').textContent = `${currDate.getFullYear()}年${(currDate.getMonth()+1)}月${currDate.getDate()}日${currDate.getHours()}点`;

    // 根据资产更新显示
    propertyList.forEach( propertyItem => {
        // 分期付款期间 以及 偿清贷款 的情况
        dividedBuyItem = dividedBuyList.find(item => item.id === propertyItem);
        if ( dividedBuyItem !== undefined ) {// 已有分期付款，只需更新数字
            // console.log('已有分期付款，只需更新数字')
            currDividedMonth = document.querySelector(`#${propertyItem} .divided-month`);
            currDividedMonth.textContent = currDividedMonth.textContent.replace(/\d+/, dividedBuyItem.dividedMonth);
            currPayCountDown = document.querySelector(`#${propertyItem} .pay-count-down`);
            currPayCountDown.textContent = currPayCountDown.textContent.replace(/\d+/, dividedBuyItem.payCountDown);
            // 更新商店按钮
            shopButton = document.getElementById('buy-'+propertyItem);
            shopButton.innerHTML = shopButton.innerHTML.replace('购买', '还款');
        } else { // 没有分期付款，去掉分期付款显示（注意：这部分如果到期不还款资产被收回则不会执行）
            document.querySelector(`#${propertyItem} .divided-month`).textContent = '';
            document.querySelector(`#${propertyItem} .pay-count-down`).textContent = '';
            // 更新商店按钮
            shopButton = document.getElementById('buy-'+propertyItem);
            shopButton.innerHTML = shopButton.innerHTML.replace('还款', '购买');
        }
    })

    // 根据资产更新职业
    updateDisplayJob();
}

// 更新商店按钮可购买选项
function updateShop() {
    shopList.forEach( shopItem => {
        if ( coinCount >= shopItem.dividedPrice) {
            document.getElementById(shopItem.id).disabled = false;
        } else {
            document.getElementById(shopItem.id).disabled = true;
        }
    })
}

// 更新分期付款到期未还款
function updateDividedPay() {
    dividedBuyList.forEach( dividedBuyItem => {
        dividedBuyItem.payCountDown--;
        if (dividedBuyItem.payCountDown === 0) {
            propertyList = propertyList.filter( item => { // 移除这个资产
                return item !== dividedBuyItem.id;
            });
            icon = document.querySelector("#mini-truck .icon");
            icon.textContent = icon.textContent.replace(dividedBuyItem.icon, "")
            document.querySelector(`#${dividedBuyItem.id} .divided-month`).textContent = '';
            document.querySelector(`#${dividedBuyItem.id} .pay-count-down`).textContent = '';
            // 更新商店按钮
            shopButton = document.getElementById('buy-'+dividedBuyItem.id);
            shopButton.innerHTML = shopButton.innerHTML.replace('还款', '购买');

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
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Add the pressed key to the userInput string
    userKeyInput += key;

    // Check if the current input matches the cheat code
    if (userKeyInput.toLowerCase().includes('gold')) {
        coinCount += 20000000000000
        userKeyInput = ''; // Reset user input after successful cheat code entry
    }
    
    // Optional: Clear user input if it exceeds the cheat code length to avoid unnecessary memory usage
    if (userKeyInput.length > 20) {
        userKeyInput = userKeyInput.substring(1);
    }
});
