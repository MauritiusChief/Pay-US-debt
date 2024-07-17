
// TODO: 买东西完全可以做成一个模块化函数，只需输入价格、emoji、分期时间等就行
document.getElementById('buy-mini-truck').addEventListener('click', () => {
    shopItem = shopList.find(shopItem => shopItem.id === 'buy-mini-truck')
    if (coinCount >= shopItem.price) {
        coinCount -= shopItem.price;
        // 添加小货车
        propertyList.push('mini-truck');
        document.querySelector("#mini-truck .icon").textContent += "🚚";
    } else if ( coinCount >= shopItem.dividedPrice) { // 进入分期付款流程
        coinCount -= shopItem.dividedPrice;

        dividedBuyItem = dividedBuyList.find(dividedBuyItem => dividedBuyItem.id === 'mini-truck')
        if ( dividedBuyItem !== undefined ) { // 已有分期付款
            // console.log('已有分期付款')
            if (dividedBuyItem.dividedMonth > 1) { // 还有1期以上
                // console.log('还有1期以上')
                dividedBuyItem.dividedMonth--;
                dividedBuyItem.payCountDown = 30;
            }  else { // 只剩1期，移除该分期付款
                // console.log('只剩1期，移除该分期付款')
                dividedBuyList = dividedBuyList.filter( dividedBuyItem => {
                    return dividedBuyItem.id !== 'mini-truck';
                });
            }
        } else { // 没有分期付款，创建新分期付款
            // console.log('没有分期付款，创建新分期付款')
            dividedBuyList.push(
                {id:'mini-truck', dividedPrice:320, dividedMonth:12, payCountDown: 30}
            )
            // 添加小货车
            propertyList.push('mini-truck');
            document.querySelector("#mini-truck .icon").textContent += "🚚";
            document.querySelector("#mini-truck .divided-month").textContent = " 分期12月 ";
            document.querySelector("#mini-truck .pay-count-down").textContent = " 支付倒计时30天";
        }
    }
    updateDisplay();
})