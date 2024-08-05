console.log('save_load.js')

function saveGame() {
    const alertMsg = translations[locale]["setting-saved"]
    localStorage.setItem('StorageGameData', JSON.stringify(gameData));
    alert(alertMsg);
}

// Function to load game state from local storage
function loadGame() {
    const alertMsg = translations[locale]["setting-loaded"]
    const alertMsgNotComplete = translations[locale]["setting-load-not-complete"]
    const savedState = localStorage.getItem('StorageGameData');
    if (savedState !== null) {
        gameData = JSON.parse(savedState);
        gameData.currDate = new Date(gameData.currDate); // 把存储的String转换回Date

        loading(gameData);
        clearInterval(currentTimer);
        gamePaused = true;

        alert(alertMsg);
    } else {
        alert(alertMsgNotComplete);
    }
    // console.log(gameData)
}

function resetGame() {
    const alertMsg = translations[locale]["setting-reset-alert"]
    if (confirm(alertMsg)) {
        gameData.coinCount = 0;
        gameData.health = 100.00;
        gameData.effectList = []
        gameData.workStat = 0; // 上班与否标记，用在资源列表更新中，0代表不上班1代表上班，以后可能会改一个方式
        gameData.workingProperty = ''
        gameData.GIdx = 0
        let dateArray = [1000, 0, 1, 9]
        gameData.currDate = new Date(...dateArray);
        updateUSDebt()
        gameData.gameFinished = false;
        gameData.installPay = false;
        gameData.installmentList = {};
        gameData.propertyList = {};
        gameData.employeeList = {};
        gameData.employeeGStack = {}; // F 代表女，M 代表男
        gameData.resourceList = initialResourceList;
        gameData.selfResourceList = initialSelfResourceList;

        $(".can-hide").addClass('hidden');
        gameData.removeHidden = {"#transport": 1}; // 只有这个是不被隐藏的
        // console.log(gameData.removeHidden)
        for (let tag in gameData.removeHidden) {
            $(tag).removeClass('hidden');
        }
        $('#model-display [type=checkbox]').prop('checked', false); // 勾选盒全部取消
        gameData.iconStore = {};
        gameData.disabledButton = {};

        clearInterval(currentTimer);
        gamePaused = true;
        updateDisplay();

        localStorage.removeItem('StorageGameData');
    }
}

function saveGameFile() {
    const alertMsg = translations[locale]["setting-file-saved"]

    const json = JSON.stringify(gameData, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(alertMsg);
}

function loadGameFile(event) {
    const alertMsg = translations[locale]["setting-file-loaded"]
    const alertMsgNotComplete = translations[locale]["setting-load-not-complete"]

    const file = event.target.files[0];
    if (!file) {
        alert(alertMsgNotComplete);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        try {
            const loadedState = JSON.parse(contents);
            gameData = JSON.parse(loadedState);
            gameData.currDate = new Date(gameData.currDate); // 把存储的String转换回Date

            loading(gameData);
            clearInterval(currentTimer);
            gamePaused = true;
        
            alert(alertMsg);
        } catch (error) {
            alert(alertMsgNotComplete);
        }
    };
    reader.readAsText(file);
}

// 读取数据共用的部分
function loading(gameData) {
    $(".can-hide").addClass('hidden');
        for (let tag in gameData.removeHidden) { // 隐藏和去除隐藏哪些tag
            $(tag).removeClass('hidden');
        }
        for (let icon in gameData.iconStore) { // 写入存储的图标
            $(icon).html( gameData.iconStore[icon] );
        }
        gameData.workingProperty !== '' ? $(`#${gameData.workingProperty} [type=checkbox]`).prop('checked', true) : {}; // 根据workingProperty复原勾选盒
        $('#install-pay [type=checkbox]').prop('checked', gameData.installPay);
        for (let button in gameData.disabledButton) { // 禁用不能点的按钮，可能会有启用不了的bug？
            $(button).prop('disabled', true);
        }
        // 性别小图标
        let selfElement = $("#self .icon");
        if (gameData.currDate.getHours() < 9 ) { // 0-8点
            selfElement.html( '🛌' );
        } else if (gameData.currDate.getHours() > 16) { // 17-23点
            selfElement.html('🛀' );
        } else {
            selfElement.html( GIcon[gameData.GIdx] );
        }
        let selfGButton = $("#change-gender")
        selfGButton.html( GTxt[gameData.GIdx] );

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
        updateDisplay();
}

function updateUSDebt() {
    // Fetch the current national debt
    fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[number]=1&page[size]=1')
    .then(response => response.json())
    .then(data => {
        const totalDebt = data.data[0].tot_pub_debt_out_amt;
        const acquireDateRec = data.data[0].record_date
        gameData.goal = parseFloat(totalDebt);
        $('#goal').text( gameData.goal.toLocaleString() + " $" );
        $('#goal-remain').text( (gameData.goal - gameData.coinCount).toLocaleString() + " $" );
        $('#goal-date').text( acquireDateRec );
        let acquireDateArray = acquireDateRec.split("-");
        acquireDateArray[1] = parseInt(acquireDateArray[1])-1; //月份问题
        let acquireDate = new Date(...acquireDateArray);
        acquireDate.setHours(9);
        // console.log(acquireDate)
        // console.log(gameData.currDate)
        if (acquireDate.getTime() > gameData.currDate.getTime()) {
            gameData.currDate = acquireDate;
            $('#current-date').html( `${acquireDate.getFullYear()}-${(acquireDate.getMonth()+1).toString().padStart(2, '0')}-${acquireDate.getDate().toString().padStart(2, '0')};  ${genClockIcon(acquireDate.getHours())}${acquireDate.getHours()}<span i18n-key="o-clock"></span>` );
            $("[i18n-key]").each(translateElement);
        }
    })
    .catch(error => {
        console.error('获取美债数据出错:', error);
        $('#goal').text( '数据获取失败' );
        $('#goal-date').text( '数据获取失败' );
    });
}