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

})
$('#employ-vampire').click(() => {

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
            propertyList[buyId] = {amount: 1, maintainStatus: 5, maintainDecrChance: 0.2};
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
                propertyList[buyId] = {amount: 1, maintainStatus: 5, maintainDecrChance: 0.2};
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