
// TODO: 买东西完全可以做成一个模块化函数，只需输入价格、emoji、分期时间等就行
document.getElementById('buy-mini-truck').addEventListener('click', () => {
    buyEvent('mini-truck', '🚚', 30);
})

document.getElementById('buy-semi-truck').addEventListener('click', () => {
    buyEvent('semi-truck', '🚛', 30);
})

document.getElementById('buy-medicine').addEventListener('click', () => {
    shopItem = shopList.find(item => item.id === ('buy-medicine') )
    coinCount -= shopItem.price;
    health += 15;
})

document.getElementById('buy-logistic-station').addEventListener('click', () => {
    buyEvent('logistic-station', '📦', 0);
})

function buyEvent(buyId, buyIcon, buyPayCountDown) {
    shopItem = shopList.find(shopItem => shopItem.id === ('buy-'+buyId) )
    buyDividedPrice = shopItem.dividedPrice; // 改为直接用shopItem数据
    buyDividedMonth = shopItem.dividedMonth; // 改为直接用shopItem数据
    if (coinCount >= shopItem.price) {
        coinCount -= shopItem.price;
        // 资产列表添加商品
        propertyList.push(buyId);
        document.querySelector(`#${buyId} .icon`).innerHTML += buyIcon;
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
            propertyList.push(buyId);
            document.querySelector(`#${buyId} .icon`).innerHTML += buyIcon;
            document.querySelector(`#${buyId} .divided-month`).innerHTML = ` 分期${buyDividedMonth}月 `;
            document.querySelector(`#${buyId} .pay-count-down`).innerHTML = ` 支付倒计时${buyPayCountDown}天`;
        }
    }
    updateDisplay();
}