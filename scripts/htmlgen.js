console.log('htmlgen.js')

// 买载具模板
const buttonVehicleData = [
    {
        id: "buy-mini-truck",
        label: "购买小货车",
        price: marketList["buy-mini-truck"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-mini-truck"].dividedPrice.toLocaleString()+" $ * " + marketList["buy-mini-truck"].dividedMonth+"月"
    },
    {
        id: "buy-semi-truck",
        label: "购买半挂车",
        price: marketList["buy-semi-truck"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-semi-truck"].dividedPrice.toLocaleString()+" $ * " + 
            marketList["buy-semi-truck"].dividedMonth+"月"
    },
    {
        id: "buy-excavator",
        label: "购买挖掘机",
        price: marketList["buy-excavator"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-excavator"].dividedPrice.toLocaleString()+" $ * " + 
            marketList["buy-excavator"].dividedMonth+"月"
    }
];
const buttonVehicleSource = $("#buy-vehicle-template").html();
const buttonVehicleTemplate = Handlebars.compile(buttonVehicleSource);
const buttonVehicleHtml = buttonVehicleTemplate(buttonVehicleData);
$("#buy-vehicle-container").html( buttonVehicleHtml );

// 买地产模板
const buttonFieldData = [
    {
        id: "buy-logistic-station",
        label: "购买仓库",
        price: marketList["buy-logistic-station"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-logistic-station"].dividedPrice.toLocaleString()+" $ * " + 
            marketList["buy-logistic-station"].dividedMonth+"月"
    }
];
const buttonFieldSource = $("#buy-field-template").html();
const buttonFieldTemplate = Handlebars.compile(buttonFieldSource);
const buttonFieldHtml = buttonFieldTemplate(buttonFieldData);
$("#buy-field-container").html( buttonFieldHtml );

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
const vehicleSource = $("#vehicle-template").html();
const vehicleTemplate = Handlebars.compile(vehicleSource);
const vehicleHtml = vehicleTemplate(vehicleData);
$("#vehicle-container").html( vehicleHtml );

// 地产展示模板
const fieldData = [
    {
        id: "logistic-station",
        label: "仓库"
    }
];
const fieldSource = $("#field-template").html();
const fieldTemplate = Handlebars.compile(fieldSource);
const fieldHtml = fieldTemplate(fieldData);
$("#field-container").html( fieldHtml );

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
const tableSource = $("#resource-template").html();
const tableTemplate = Handlebars.compile(tableSource);
const tableHtml = tableTemplate(tableData);
$("#resource-container").html( tableHtml );