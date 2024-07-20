

$('#buy-mini-truck').click(() => {
    buyEvent('mini-truck', '🚚', 30);
})

$('#buy-semi-truck').click(() => {
    buyEvent('semi-truck', '🚛', 30);
})

$('#buy-health-elixir').click(() => {
    shopItem = shopList.find(item => item.id === ('buy-health-elixir') )
    coinCount -= shopItem.price;
    health += 20;
})

$('#buy-logistic-station').click(() => {
    buyEvent('logistic-station', '📦', 0);
})

function buyEvent(buyId, buyIcon, buyPayCountDown) {
    shopItem = shopList.find(shopItem => shopItem.id === ('buy-'+buyId) )
    buyDividedPrice = shopItem.dividedPrice; // 改为直接用shopItem数据
    buyDividedMonth = shopItem.dividedMonth; // 改为直接用shopItem数据
    if (coinCount >= shopItem.price) {
        coinCount -= shopItem.price;
        // 资产列表添加商品
        propertyItem = propertyList.find(item => {
            return item.id === buyId
        })
        if ( propertyItem !== undefined ) {// 已有这个商品
            propertyItem.amount++;
        } else { // 没有这个商品，创建这个商品
            propertyList.push(
                {id: buyId, amount: 1, maintainStatus: 5, maintainDecrChance: 0.2}
            );
        }
        $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
        $(`#${buyId}`).removeClass('hidden'); // 去除隐藏
    } else if ( buyPayCountDown > 0 && coinCount >= shopItem.dividedPrice) { // 进入分期付款流程
        // 这部分代码只有运行分期付款的商品才执行
        coinCount -= shopItem.dividedPrice;

        dividedBuyItem = dividedBuyList.find(item => item.id === buyId);
        if ( dividedBuyItem !== undefined ) { // 已有分期付款
            // console.log('已有分期付款')
            if (dividedBuyItem.dividedMonth > 1) { // 还有1期以上
                // console.log('还有1期以上')
                dividedBuyItem.dividedMonth--;
                dividedBuyItem.payCountDown = 30;
            }  else { // 只剩1期，移除该分期付款
                // console.log('只剩1期，移除该分期付款')
                dividedBuyList = dividedBuyList.filter( item => {
                    return item.id !== buyId;
                });
            }
        } else { // 没有分期付款，创建新分期付款
            // console.log('没有分期付款，创建新分期付款')
            dividedBuyList.push(
                {id: buyId, icon: buyIcon, dividedPrice: buyDividedPrice, dividedMonth: buyDividedMonth, payCountDown: buyPayCountDown}
            )
            // 添加商品以及分期付款标识
            propertyItem = propertyList.find(item => {
                return item.id === buyId
            })
            if ( propertyItem !== undefined ) {// 已有这个商品
                propertyItem.amount++;
            } else { // 没有这个商品，创建这个商品
                propertyList.push(
                    {id: buyId, amount: 1, maintainStatus: 5, maintainDecrChance: 0.2}
                );
            }
            $(`#${buyId} .icon`).html( $(`#${buyId} .icon`).html()+buyIcon );
            $(`#${buyId} .divided-month`).html( ` 分期${buyDividedMonth}月 ` );
            $(`#${buyId} .pay-count-down`).html( ` 支付倒计时${buyPayCountDown}天` );
            $(`#${buyId}`).removeClass('hidden'); // 去除隐藏
        }
    }
    // console.log(propertyList)
    updateDisplay();
}