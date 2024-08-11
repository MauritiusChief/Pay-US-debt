console.log('main.js')

/** 初始化
 ********/
// 初始执行函数
updateShop();
updateDisplay();

// 获取美国国债数据以及日期
updateUSDebt();

/** 游戏机制 
 ***********/
/**被动每小时事件（特指不工作时定时触发的时间流逝）
 * 需要变量：
 *      gameData.currDate
 * 使用函数：
 *      everyHourEvent()
 *      updateShop()
 *      updateDisplay()
 * 更新变量：
 *      gameData.workStat（0，没上班）
 *      gameData.health
 * HTML更新
 */
function passiveHourEvent() {

    // 触发不上班效果 TODO:可以做成分开的函数
    gameData.workStat = 0;
    // 不上班则回复健康
    if (gameData.currDate.getHours() < 9) { // 0-8点
        gameData.health < 0 ? gameData.health += 0.1 : gameData.health += 2;
    } else { // 9点之后整天
        gameData.health < 0 ? gameData.health += 0.05 : gameData.health += 1;
    }
    gameData.health > 100 ? gameData.health = 100 : {};
    // 消除（加班中）标记
    $('#overtime').attr("i18n-key", "work-resting");
    // 小人不加班时的图标
    $("[type=person] .icon").each(function (index, personTag) {
        let $personTag = $(personTag);
        if (gameData.currDate.getHours() < 9) { // 0-8点
            $personTag.html('🛌');
        } else if (gameData.currDate.getHours() > 16) { // 17-23点
            $personTag.html('🛀');
        } else {
            $personTag.html(GIcon[gameData.GIdx]);
        }
    })

    everyHourEvent();
    updateDisplay();


    // console.log(gameData.propertyList)
    // console.log(gameData.installmentList)
}
/**实际的步进时间事件
 * 需要变量：
 *      gameData.coinCount
 *      actuIncomePerH
 * 使用函数：
 *      updateResource()
 * HTML更新
 */
function everyHourEvent() {
    gameData.currDate.setHours(gameData.currDate.getHours() + 1);
    // 直观时间变化
    if (gameData.currDate.getHours() <= 6) { // 0-6点
        $('body').removeClass("dawn-mode");
        $('body').addClass("dark-mode");
    } else if (gameData.currDate.getHours() <= 9 || gameData.currDate.getHours() > 16) { // 7-9点 & 17-23点
        $('body').removeClass("dark-mode");
        $('body').addClass("dawn-mode");
    } else {
        $('body').removeClass("dark-mode");
        $('body').removeClass("dawn-mode");
    }

    if (gameData.currDate.getHours() === 10) {
        everyDayEvent();
    }

    // 无论时间流逝是定时触发还是点击触发都需执行的内容
    updateShop();
    updateResource();
    gameData.coinCount += actuIncomePerH;

    checkGoal();
}
/**每日事件
 */
function everyDayEvent() {
    updateDividedPay()
    if (gameData.currDate.getDate() === 1) {
        everyMonthEvent();
    }
}
/**每月事件
 */
function everyMonthEvent() {
    for (id in gameData.employeeList) {
        // console.log(employList[`employ-${id}`].salary)
        gameData.coinCount -= employList[`employ-${id}`].salary * gameData.employeeList[id].amount;
    }

}

/**点击挣钱按钮（工作点击触发的时间流逝）
 * 需要变量：
 *      gameData.currDate
 * 使用函数：
 *      everyHourEvent()
 *      updateShop()
 *      updateDisplay()
 * 更新变量：
 *      gameData.workStat（1，上班）
 *      gameData.health
 *      gamePaused（false，解除暂停）
 * HTML更新
 */
$('#click-button').click(clickButton);
function clickButton() {

    // 触发上班的效果
    gameData.workStat = 1;
    // 变更上班与加班时的图标
    let selfElement = $("#self .icon");
    selfElement.html(GIcon[gameData.GIdx]);
    if (gameData.currDate.getHours() < 9 || gameData.currDate.getHours() > 16) {
        // 加班标记
        $('#overtime').attr("i18n-key", "work-overtime");
    } else {
        $('#overtime').removeAttr("i18n-key");
        $('#overtime').text("");
    }
    // 上班与加班时减少健康
    if (gameData.currDate.getHours() < 9) { // 0-8点
        gameData.health -= 2;
    } else if (gameData.currDate.getHours() > 16) { // 17点-23点
        gameData.health -= 1.5;
    } else {
        gameData.health -= 1;
    }

    // 每次点击则重置计时，避免时间跳动
    clearInterval(currentTimer);
    currentTimer = setInterval(passiveHourEvent, 1000);
    gamePaused = false;
    $('#game-pause').attr("i18n-key", "game-pause");

    everyHourEvent();
    updateDisplay();
};

$('#game-pause').click(gamePause);
function gamePause() {
    if (gamePaused) { // 已暂停
        currentTimer = setInterval(passiveHourEvent, 1000);
        $('#game-pause').attr("i18n-key", "game-pause");
        gamePaused = false;
    } else { // 没暂停
        clearInterval(currentTimer);
        $('#game-pause').attr("i18n-key", "game-continue");
        gamePaused = true;
    }
    $("[i18n-key]").each(translateElement); // 更新文本翻译
}

$('#change-gender').click(() => {
    gameData.GIdx = (gameData.GIdx + 1) % 3;
    // console.log(oldGIdx+'=>'+GIdx)
    // console.log(GIcon[oldGIdx]+'=>'+GIcon[gameData.GIdx])
    let selfElement = $("#self .icon");
    if (gameData.currDate.getHours() < 9) { // 0-8点
        selfElement.html('🛌');
    } else if (gameData.currDate.getHours() > 16) { // 17-23点
        selfElement.html('🛀');
    } else {
        selfElement.html(GIcon[gameData.GIdx]);
    }
    let selfGButton = $("#change-gender")
    selfGButton.html(GTxt[gameData.GIdx]);
    // updateDisplay();
})

$('#language-select').on('change', (e) => {
    let selectedValue = e.target.value;

    if (selectedValue === "") {
        locale = supportedLocale.includes(navLocal) ? navLocal : defaultLocale;
    } else {
        locale = selectedValue;
    }

    $("[i18n-key]").each(translateElement);
})

$('#update-us-debt').click(() => {
    // 这里不知道如何用attribute修改，故只能这样
    const conferMsg = translations[locale]["setting-get-debt-alert"]
    if (confirm(conferMsg)) {
        updateUSDebt();
    }
});

$('#game-save').click(() => {
    saveGame()
});
$('#game-load').click(() => {
    loadGame()
});
$('#game-reset').click(() => {
    resetGame()
});
$('#game-save-file').click(() => {
    saveGameFile()
});
$('#game-load-file').click(() => {
    $('#fileInput').click();
});
$('#fileInput').on('change', loadGameFile);



/** 更新函数
 ***********/
/**商店按钮锁定与解锁；点击挣钱按钮锁定与解锁
 * 需要变量：
 *      marketList
 *      gameData.coinCount
 *      gameData.health
 * HTML更新：
 */
function updateShop() {
    for (let id in marketList) {
        limitPrice = gameData.installPay ? marketList[id].installPrice : marketList[id].price;
        if (gameData.coinCount >= limitPrice) {
            $(`#${id}`).prop('disabled', false);
            delete gameData.disabledButton[`#${id}`];
        } else {
            $(`#${id}`).prop('disabled', true);
            gameData.disabledButton[`#${id}`] = 1;
        }
    }
    for (let id in shopList) {
        limitPrice = shopList[id].price;
        if (gameData.coinCount >= limitPrice) {
            $(`#${id}`).prop('disabled', false);
            delete gameData.disabledButton[`#${id}`];
        } else {
            $(`#${id}`).prop('disabled', true);
            gameData.disabledButton[`#${id}`] = 1;
        }
    }
    for (let id in employList) {
        correspondEmployee = gameData.employeeList[id.replace("employ-", "")];
        currentAmount = correspondEmployee ? correspondEmployee.amount : 1;
        limitPrice = employList[id].salary * currentAmount;
        // 限制：至少得发的起所有员工一个月的工资
        if (gameData.coinCount > limitPrice) {
            $(`#${id}`).prop('disabled', false);
            delete gameData.disabledButton[`#${id}`];
        } else {
            $(`#${id}`).prop('disabled', true);
            gameData.disabledButton[`#${id}`] = 1;
        }
    }
    // 得病无法工作也借用此处
    ableToWork = gameData.health < 0 ? true : false;
    $("#click-button").prop('disabled', ableToWork)
}

/**根据分期付款到期未还款更新或移除资产（包含相关更新显示）
 * HTML更新：
 *      删除分期付款文本的分期月、还款倒计时天数
 *      勾选盒取消勾选；劳动力面板隐藏
 * 更新变量：
 *      gameData.installmentList
 *      gameData.propertyList（需保证gameData.installmentList.item必须在gameData.propertyList中有对应）
 *      gameData.workingProperty
 */
function updateDividedPay() {
    for (let id in gameData.installmentList) {
        gameData.installmentList[id].payCountDown--;
        if (gameData.installmentList[id].payCountDown === 0) {
            // 移除这个资产
            propertyItem = gameData.propertyList[id];
            // 移除这个资产前，先把在此资产工作的劳动力解放
            $(`#${id} [type=decr]`).click(); // 模拟点击减少劳动力的按钮
            if (propertyItem.amount > 1) { // 资产数量-1
                propertyItem.amount--;
            } else { // 资产数量不足1，直接移除
                delete gameData.propertyList[id];
                // 更新勾选盒以及gameData.workingProperty
                $('#model-display [type=checkbox]').not(id).prop('checked', false);
                $(`#${id}`).addClass('hidden');
                delete gameData.removeHidden[`#${id}`];
                gameData.workingProperty === id ? gameData.workingProperty = '' : {};
            }

            icon = $(`#${id} .icon`);
            icon.html(icon.html().replace(gameData.installmentList[id].icon, ""));
            gameData.iconStore[`#${id} .icon`] = icon.html();
            $(`#install-${id}`).addClass('hidden');
            delete gameData.removeHidden[`#install-${id}`];
            delete gameData.installmentList[id]; // 移除这个分期付款
        }
    }
}

function checkGoal() {
    if (gameData.coinCount >= gameData.goal && !gameData.gameFinished) {
        gameData.gameFinished = true;
        alert("恭喜你！你帮美帝还清了全部美债！星条旗永不落！");
    }
}

/** 键盘输入 */
let userKeyInput = ''
$(document).on('keydown', function (event) {
    const key = event.key;

    // Add the pressed key to the userInput string
    userKeyInput += key;

    if (userKeyInput.includes(' ')) { // 空格暂停
        gamePause();
        userKeyInput = '';
    }

    // Check if the current input matches the cheat code
    if (userKeyInput.toLowerCase().includes('paxamericana')) {
        gameData.coinCount += 20000000000000
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('gold')) {
        gameData.coinCount += 50000
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('money')) {
        gameData.coinCount += 6000
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('coin')) {
        gameData.coinCount += 500
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('timefly')) { // 快速过5天
        clearInterval(currentTimer);
        Array(5 * 24).fill().forEach(() => passiveHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(passiveHourEvent, 1000);
        }
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('tictoc')) { // 快速过1天
        clearInterval(currentTimer);
        Array(24).fill().forEach(() => passiveHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(passiveHourEvent, 1000);
        }
        userKeyInput = '';
    }
    if (userKeyInput.toLowerCase().includes('workhard')) { // 标准模板工作5天
        clearInterval(currentTimer);
        Array(5 * 24).fill().forEach(() => {
            if (gameData.currDate.getHours() > 8) {
                clickButton();
                clearInterval(currentTimer);
            } else {
                passiveHourEvent();
            }
        });
        if (!gamePaused) {
            currentTimer = setInterval(passiveHourEvent, 1000);
        }
        userKeyInput = '';
    }

    // Optional: Clear user input if it exceeds the cheat code length to avoid unnecessary memory usage
    if (userKeyInput.length > 20) {
        userKeyInput = userKeyInput.substring(1);
    }
});

