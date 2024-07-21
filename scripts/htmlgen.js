console.log('htmlgen.js')

const buttonData = [
    {
        id: "buy-mini-truck",
        label: "购买小货车",
        price: "3,500.00 $",
        installment: "640.00 $ * 6月"
    },
    {
        id: "buy-semi-truck",
        label: "购买半挂车",
        price: "18,500.00 $",
        installment: "3,400.00 $ * 6月"
    },
    {
        id: "buy-excavator",
        label: "购买挖掘机",
        price: "31,000.00 $",
        installment: "2,840.00 $ * 12月"
    }
];
// 编译并渲染按钮模板
const buttonSource = document.getElementById("buy-vehicle-template").innerHTML;
const buttonTemplate = Handlebars.compile(buttonSource);
const buttonHtml = buttonTemplate(buttonData);
document.getElementById("buy-vehicle-container").innerHTML = buttonHtml;

const paragraphData = [
    {
        id: "mini-truck",
        label: "小货车",
        prompt: "开小货车"
    },
    {
        id: "semi-truck",
        label: "半挂车",
        prompt: "开半挂车"
    },
    {
        id: "excavator",
        label: "挖掘机",
        prompt: "开挖掘机"
    }
];
// 编译并渲染段落模板
const paragraphSource = document.getElementById("property-template").innerHTML;
const paragraphTemplate = Handlebars.compile(paragraphSource);
const paragraphHtml = paragraphTemplate(paragraphData);
document.getElementById("property-container").innerHTML = paragraphHtml;
