let coinCount = 0;
let coinsPerClick = 1;
let autoClickerCost = 10;
let upgradeClickCost = 20;
let autoClickerEarn = 10^5;
let goal = 0;

// 点击挣钱按钮
document.getElementById('click-button').addEventListener('click', () => {
    coinCount += coinsPerClick;
    updateDisplay();
    checkGoal();
});

// 自动点击器升级按钮
document.getElementById('auto-clicker').addEventListener('click', () => {
    if (coinCount >= autoClickerCost) {
        coinCount -= autoClickerCost;
        autoClickerCost *= 2; // Increase cost for next purchase
		autoClickerEarn *= 2;
        setInterval(() => {
            coinCount += autoClickerEarn;
            updateDisplay();
        }, 1);
        updateDisplay();
    }
});

// 单次点击升级按钮
document.getElementById('upgrade-click').addEventListener('click', () => {
    if (coinCount >= upgradeClickCost) {
        coinCount -= upgradeClickCost;
        upgradeClickCost *= 2; // Increase cost for next purchase
        coinsPerClick *= 2; // Double coins per click
        updateDisplay();
    }
});

function updateDisplay() {
    document.getElementById('coin-count').textContent = `${coinCount.toLocaleString()} $`;
    document.getElementById('coins-per-click').textContent = `${coinsPerClick.toLocaleString()} $`;
    document.getElementById('auto-clicker').textContent = `自动点击器  (${autoClickerCost.toLocaleString()} $)`;
    document.getElementById('upgrade-click').textContent = `点击升级 (${upgradeClickCost.toLocaleString()} $)`;
}

function checkGoal() {
    if (coinCount >= goal) {
        alert("恭喜你！你帮美帝还清了全部美债！星条旗永不落！");
    }
}

// Fetch the current national debt
fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[number]=1&page[size]=1')
    .then(response => response.json())
    .then(data => {
		const totalDebt = data.data[0].tot_pub_debt_out_amt;
		const goalDate = data.data[0].record_date
        goal = parseFloat(totalDebt);
        document.getElementById('goal').textContent = goal.toLocaleString() + " $";
		document.getElementById('goal-date').textContent = goalDate;
    })
    .catch(error => {
        console.error('获取美债数据出错:', error);
        document.getElementById('goal').textContent = '数据获取失败';
		document.getElementById('goal-date').textContent = '数据获取失败';
    });