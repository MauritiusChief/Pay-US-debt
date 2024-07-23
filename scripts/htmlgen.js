console.log('htmlgen.js')

// 买载具模板
const buttonVehicleData = [
    {
        id: "buy-mini-truck",
        label: "购买小货车",
        price: marketList.find(item => item.id === ("buy-mini-truck") ).price.toLocaleString()+" $",
        installment: 
            marketList.find(item => item.id === ("buy-mini-truck") ).dividedPrice.toLocaleString()+" $ * " + marketList.find(item => item.id === ("buy-mini-truck") ).dividedMonth+"月"
    },
    {
        id: "buy-semi-truck",
        label: "购买半挂车",
        price: marketList.find(item => item.id === ("buy-semi-truck") ).price.toLocaleString()+" $",
        installment: 
            marketList.find(item => item.id === ("buy-semi-truck") ).dividedPrice.toLocaleString()+" $ * " + 
            marketList.find(item => item.id === ("buy-semi-truck") ).dividedMonth+"月"
    },
    {
        id: "buy-excavator",
        label: "购买挖掘机",
        price: marketList.find(item => item.id === ("buy-excavator") ).price.toLocaleString()+" $",
        installment: 
            marketList.find(item => item.id === ("buy-excavator") ).dividedPrice.toLocaleString()+" $ * " + 
            marketList.find(item => item.id === ("buy-excavator") ).dividedMonth+"月"
    }
];
const buttonVehicleSource = document.getElementById("buy-vehicle-template").innerHTML;
const buttonVehicleTemplate = Handlebars.compile(buttonVehicleSource);
const buttonVehicleHtml = buttonVehicleTemplate(buttonVehicleData);
document.getElementById("buy-vehicle-container").innerHTML = buttonVehicleHtml;

// 买地产模板
const buttonFieldData = [
    {
        id: "buy-logistic-station",
        label: "购买仓库",
        price: marketList.find(item => item.id === ("buy-logistic-station") ).price.toLocaleString()+" $",
        installment: 
            marketList.find(item => item.id === ("buy-logistic-station") ).dividedPrice.toLocaleString()+" $ * " + 
            marketList.find(item => item.id === ("buy-logistic-station") ).dividedMonth+"月"
    }
];
const buttonFieldSource = document.getElementById("buy-field-template").innerHTML;
const buttonFieldTemplate = Handlebars.compile(buttonFieldSource);
const buttonFieldHtml = buttonFieldTemplate(buttonFieldData);
document.getElementById("buy-field-container").innerHTML = buttonFieldHtml;

// 载具展示模板
const vehicleData = [
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
const vehicleSource = document.getElementById("vehicle-template").innerHTML;
const vehicleTemplate = Handlebars.compile(vehicleSource);
const vehicleHtml = vehicleTemplate(vehicleData);
document.getElementById("vehicle-container").innerHTML = vehicleHtml;

// 地产展示模板
const fieldData = [
    {
        id: "logistic-station",
        label: "仓库"
    }
];
const fieldSource = document.getElementById("field-template").innerHTML;
const fieldTemplate = Handlebars.compile(fieldSource);
const fieldHtml = fieldTemplate(fieldData);
document.getElementById("field-container").innerHTML = fieldHtml;

// 资源列表模板
const tableData = [
    {
        id: "transport",
        label: "📦运力"
    },
    {
        id: "construct",
        label: "🚧建造力"
    }
];
const tableSource = document.getElementById("resource-template").innerHTML;
const tableTemplate = Handlebars.compile(tableSource);
const tableHtml = tableTemplate(tableData);
document.getElementById("resource-container").innerHTML = tableHtml;