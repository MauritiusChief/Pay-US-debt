let coinCount = 0;
let coinsPerClick = 12.5;

let autoClickerEarn = 1;
let goal = 10;
let dateArray = [1000, 0, 1, 8]
let currDate = new Date(...dateArray);
let gameStarted = false;
let currentTimer;

// alert("你是一个正直的美国公民，被奸人诬陷投入此赛博牢狱，你需要还清所有美国国债来重获自由。点击按钮挣取美刀。")

// document.getElementById('click-button').addEventListener('click', () => {
//     if (!gameStarted) {
//         currentTimer = setInterval(everyHourEvent, 6000);
//         gameStarted = true;
//     }
// })

function everyHourEvent() {
    incrementTime();
    // 消除（加班中）标记
    jobText = document.getElementById('current-job').textContent;
    document.getElementById('current-job').textContent = jobText.replace("（加班中）", '');
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

    updateDisplay();
}

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

// 点击挣钱按钮
document.getElementById('click-button').addEventListener('click', () => {
    coinCount += coinsPerClick;
    incrementTime();
    // 加班标识
    if (currDate.getHours() < 9 || currDate.getHours() > 17) {
        let selfElement = document.getElementById("self");
        selfElement.innerHTML = selfElement.innerHTML.replace('🛌', '🧍‍♂️');
        selfElement.innerHTML = selfElement.innerHTML.replace('🛀', '🧍‍♂️');
        if (!document.getElementById('current-job').textContent.includes("（加班中）")) {
            document.getElementById('current-job').textContent += "（加班中）";
        }
    }
    
    // 每次点击则重置计时，避免时间跳动
    clearInterval(currentTimer);
    currentTimer = setInterval(everyHourEvent, 1000);
    
    updateDisplay();
    checkGoal();
});

document.getElementById('game-pause').addEventListener('click', () => {
    clearInterval(currentTimer);
})

// 自动点击器升级按钮
// document.getElementById('auto-clicker').addEventListener('click', () => {
//     if (coinCount >= autoClickerCost) {
//         coinCount -= autoClickerCost;
//         autoClickerCost *= 2; // Increase cost for next purchase
// 		autoClickerEarn *= 2;
//         setInterval(() => {
//             coinCount += autoClickerEarn;
//             updateDisplay();
//         }, 1);
//         updateDisplay();
//     }
// });

// // 单次点击升级按钮
// document.getElementById('upgrade-click').addEventListener('click', () => {
//     if (coinCount >= upgradeClickCost) {
//         coinCount -= upgradeClickCost;
//         upgradeClickCost *= 2; // Increase cost for next purchase
//         coinsPerClick *= 2; // Double coins per click
//         updateDisplay();
//     }
// });

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
}

function updateDisplay() {
    document.getElementById('coin-count').textContent = `${coinCount.toLocaleString()} $`;
    document.getElementById('coins-per-click').textContent = `${coinsPerClick.toLocaleString()} $`;
    document.getElementById('goal-remain').textContent = `${(goal - coinCount).toLocaleString()} $`;
    document.getElementById('current-date').textContent = `${currDate.getFullYear()}年${(currDate.getMonth()+1)}月${currDate.getDate()}日${currDate.getHours()}点`;
    
}

function updateShop() {

}

function checkGoal() {
    if (coinCount >= goal) {
        alert("恭喜你！你帮美帝还清了全部美债！星条旗永不落！");
    }
}

