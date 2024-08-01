console.log('shop.js')

$('#divide-pay [type=checkbox]').on('change', () => {
    dividePay = !dividePay;
    // console.log(dividePay)
    updateShop();
    updateDisplay();
})
$('#buy-mini-truck').click(() => {
    buyEvent('mini-truck', '🚚', 30);
})
$('#buy-semi-truck').click(() => {
    buyEvent('semi-truck', '🚛', 30);
})
$('#buy-excavator').click(() => {
    buyEvent('excavator', '<img src="icons/excavator.svg" alt="🚜" class="svg-icon">', 30);
})
$('#buy-warehouse').click(() => {
    buyEvent('warehouse', '<img src="icons/warehouse.svg" alt="📦" class="svg-icon">', 30);
})

$('#buy-health-elixir').click(() => {
    shopItem = shopList['buy-health-elixir']
    coinCount -= shopItem.price;
    health += 20;
})

$('#employ-zombie').click(() => {
    employEvent('zombie', '🧟‍♀️', '🧟‍♂️');
    $('.use-worker').removeClass('hidden');
})
$('#dismiss-zombie').click(() => {
    dismissEvent('zombie', '🧟‍♀️', '🧟‍♂️');
})
$('#employ-vampire').click(() => {
    employEvent('vampire', '🧛‍♀️', '🧛‍♂️');
})
$('#dismiss-vampire').click(() => {
    dismissEvent('vampire', '🧛‍♀️', '🧛‍♂️');
})


/**购买事件，根据钱数全款购买或者分期付款购买
 * 需要变量：
 *      dividePay
 *      marketList
 *      coinCount
 * HTML更新：
 *      在模型面板添加emoji
 *      劳动力面板去除隐藏
 * 更新变量：
 *      propertyList（商品入库）
 *      dividedBuyList（分期付款时，加上分期付款记录）
 */
function buyEvent(buyId, buyIcon, buyPayCountDown) {
    marketItem = marketList['buy-'+buyId];
    buyDividedPrice = marketItem.dividedPrice; // 改为直接用marketItem数据
    buyDividedMonth = marketItem.dividedMonth; // 改为直接用marketItem数据

    if (!dividePay) { // 进入全款流程
        // console.log("进入全款流程")
        coinCount -= marketItem.price;
        // 资产列表添加商品
        propertyItem = propertyList[buyId];
        if ( propertyItem !== undefined ) {// 已有这个商品
            propertyItem.amount++;
        } else { // 没有这个商品，创建这个商品
            propertyList[buyId] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
        }

        $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
        $(`#${buyId}`).removeClass('hidden'); // 去除隐藏

    } else if ( buyPayCountDown > 0 && dividePay) { // 进入分期付款流程
        // console.log("进入分期付款流程")
        // 这部分代码只有运行分期付款的商品才执行
        coinCount -= marketItem.dividedPrice;

        dividedBuyItem = dividedBuyList[buyId];
        if ( dividedBuyItem !== undefined ) { // 已有分期付款
            // console.log('已有分期付款')
            if (dividedBuyItem.dividedMonth > 1) { // 还有1期以上
                // console.log('还有1期以上')
                dividedBuyItem.dividedMonth--;
                dividedBuyItem.payCountDown = 30;
            }  else { // 只剩1期，移除该分期付款
                // console.log('只剩1期，移除该分期付款')
                delete dividedBuyList[buyId]
            }
        } else { // 没有分期付款，创建新分期付款
            // console.log('没有分期付款，创建新分期付款')
            dividedBuyList[buyId] = {icon: buyIcon, dividedPrice: buyDividedPrice, dividedMonth: buyDividedMonth, payCountDown: buyPayCountDown};
            // 添加商品以及分期付款标识
            propertyItem = propertyList[buyId];
            if ( propertyItem !== undefined ) {// 已有这个商品
                propertyItem.amount++;
            } else { // 没有这个商品，创建这个商品
                propertyList[buyId] = {amount: 1, amountUsed: 0, maintainStatus: 5, maintainDecrChance: 0.2};
            }
            
            $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
            $(`#${buyId} .divided-month`).html( ` 分期${buyDividedMonth}月 ` );
            $(`#${buyId} .pay-count-down`).html( ` 支付倒计时${buyPayCountDown}天` );
            $(`#${buyId}`).removeClass('hidden'); // 去除隐藏
        }
    }
    // console.log(propertyList)
    updateShop();
    updateDisplay();
}

function employEvent(empId, iconF, iconM) {
    employItem = employList['employ-'+empId];
    employeeItem = employeeList[empId];
    empSalary = employItem.salary;
    if ( employeeItem !== undefined ) {// 已有这个商品
        employeeItem.amount++;
    } else { // 没有这个商品，创建这个商品
        employeeList[empId] = {amount: 1, amountWorking: 0, maintainStatus: 5, maintainDecrChance: 0.2};
    }
    gender = Math.random() > 0.5 ? 'F' : 'M';
    employeeGStack.push(gender);
    empIcon = gender === 'F' ? iconF : iconM;
    $(`#${empId} .icon`).html( $(`#${empId} .icon`).html()+empIcon );
    $(`#${empId}`).removeClass('hidden'); // 去除隐藏

    // 解锁解雇按钮
    if (employeeList[empId].amountWorking < employeeList[empId].amount) {
        $(`#dismiss-${empId}`).prop('disabled', false);
    }

    updateResource();
    updateDisplay();
}

function dismissEvent(empId, iconF, iconM) {
    employeeItem = employeeList[empId];
    if (employeeItem.amount > 1) { // 劳动力数量-1
        employeeItem.amount--;
        // 锁定按钮，避免人被解雇了其工作的资产还在运转
        if (employeeItem.amountWorking >= employeeItem.amount) {
            $(`#dismiss-${empId}`).prop('disabled', true);
        }
    } else { // 劳动力数量不足1，直接移除
        delete employeeList[empId];
        $(`#${empId}`).addClass('hidden');
    }
    icon = $(`#${empId} .icon`);
    iconToDelete = employeeGStack.pop() === 'F' ? iconF : iconM;
    // 以下四行是为了实现删除最后一个emoji而不是第一个emoji的效果
    reversedHtml = icon.html().split('').reverse().join('');
    revIconToDelete = iconToDelete.split('').reverse().join('');
    reversedHtml = reversedHtml.replace(revIconToDelete, "");
    reversedHtml = reversedHtml.split('').reverse().join('');

    icon.html( reversedHtml );

    

    updateResource();
    updateDisplay();
}