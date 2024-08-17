console.log('加载keyinput.js')

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

    // Define a function to handle cheat code actions
    function checkCheatCode(cheat, action) {
        if (userKeyInput.toLowerCase().includes(cheat)) {
            action();
            userKeyInput = '';
        }
    }

    checkCheatCode('paxamericana', () => {
        gameData.coinCount += 20000000000000;
    });

    checkCheatCode('gold', () => {
        gameData.coinCount += 50000;
    });

    checkCheatCode('money', () => {
        gameData.coinCount += 6000;
    });

    checkCheatCode('coin', () => {
        gameData.coinCount += 500;
    });

    checkCheatCode('timefly', () => { // 快速过5天
        clearInterval(currentTimer);
        Array(5 * 24).fill().forEach(() => passiveHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(passiveHourEvent, 1000);
        }
    });

    checkCheatCode('tictoc', () => { // 快速过1天
        clearInterval(currentTimer);
        Array(24).fill().forEach(() => passiveHourEvent());
        if (!gamePaused) {
            currentTimer = setInterval(passiveHourEvent, 1000);
        }
    });

    checkCheatCode('workhard', () => { // 标准模板工作5天
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
    });

    // Optional: Clear user input if it exceeds the cheat code length to avoid unnecessary memory usage
    if (userKeyInput.length > 20) {
        userKeyInput = userKeyInput.substring(1);
    }
});