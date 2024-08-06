console.log('htmlgen.js')

// 买载具模板
const buttonVehicleData = [
    {
        id: "mini-truck",
        price: marketList["buy-mini-truck"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-mini-truck"].installPrice.toLocaleString()+" $ * " + 
            marketList["buy-mini-truck"].installMonth+"<span i18n-key=\"mkt-month\">月</span>"
    },
    {
        id: "semi-truck",
        price: marketList["buy-semi-truck"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-semi-truck"].installPrice.toLocaleString()+" $ * " + 
            marketList["buy-semi-truck"].installMonth+"<span i18n-key=\"mkt-month\">月</span>"
    },
    {
        id: "excavator",
        price: marketList["buy-excavator"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-excavator"].installPrice.toLocaleString()+" $ * " + 
            marketList["buy-excavator"].installMonth+"<span i18n-key=\"mkt-month\">月</span>"
    }
];
const buttonVehicleSource = $("#buy-vehicle-template").html();
const buttonVehicleTemplate = Handlebars.compile(buttonVehicleSource);
const buttonVehicleHtml = buttonVehicleTemplate(buttonVehicleData);
$("#buy-vehicle-container").html( buttonVehicleHtml );

// 买地产模板
const buttonFieldData = [
    {
        id: "warehouse",
        price: marketList["buy-warehouse"].price.toLocaleString()+" $",
        installment: 
            marketList["buy-warehouse"].installPrice.toLocaleString()+" $ * " + 
            marketList["buy-warehouse"].installMonth+"<span i18n-key=\"mkt-month\">月</span>"
    }
];
const buttonFieldSource = $("#buy-field-template").html();
const buttonFieldTemplate = Handlebars.compile(buttonFieldSource);
const buttonFieldHtml = buttonFieldTemplate(buttonFieldData);
$("#buy-field-container").html( buttonFieldHtml );

// 雇佣模板
const employData = [
    {
        id: "zombie",
        icon: "🧟",
        salary: employList["employ-zombie"].salary.toLocaleString()+" $ /<span i18n-key=\"mkt-month\">月</span>",
    },
    {
        id: "vampire",
        icon: "🧛",
        salary: employList["employ-vampire"].salary.toLocaleString()+" $ /<span i18n-key=\"mkt-month\">月</span>",
    }
];
const employSource = $("#employ-template").html();
const employTemplate = Handlebars.compile(employSource);
const employHtml = employTemplate(employData);
$("#employ-container").html( employHtml );

// 建造模板
const buildData = [
    {
        id: "office",
        input: buildList["build-office"].constructInput[0]+"~"+buildList["build-office"].constructInput[1],
        total: buildList["build-office"].constructTotal,
    }
];
const buildSource = $("#build-template").html();
const buildTemplate = Handlebars.compile(buildSource);
const buildHtml = buildTemplate(buildData);
$("#build-container").html( buildHtml );

// 载具展示模板
const vehicleData = [
    {
        id: "mini-truck"
    },
    {
        id: "semi-truck"
    },
    {
        id: "excavator"
    }
];
const vehicleSource = $("#vehicle-template").html();
const vehicleTemplate = Handlebars.compile(vehicleSource);
const vehicleHtml = vehicleTemplate(vehicleData);
$("#vehicle-container").html( vehicleHtml );

// 地产展示模板
const fieldData = [
    {
        id: "warehouse"
    }
];
const fieldSource = $("#field-template").html();
const fieldTemplate = Handlebars.compile(fieldSource);
const fieldHtml = fieldTemplate(fieldData);
$("#field-container").html( fieldHtml );

// 劳动力展示模板
const workForceData = [
    {
        id: "zombie",
        type: "undead"
    },
    {
        id: "vampire",
        type: "undead"
    }
]
const workForceSource = $("#work-force-template").html();
const workForceTemplate = Handlebars.compile(workForceSource);
const workForceHtml = workForceTemplate(workForceData);
$("#work-force-container").html( workForceHtml );

// 资源列表模板
const tableData = [
    {
        id: "transport",
        icon: "📦",
        unit: "kg"
    },
    {
        id: "construct",
        icon: "🚧",
        unit: "㎡"
    },
    {
        id: "manage",
        icon: "📋",
        unit: "<span i18n-key=\"reso-labor\">人</span>"
    },
    {
        id: "gear",
        icon: "⚙️",
        unit: "<span i18n-key=\"reso-set\">组</span>"
    },
    {
        id: "nut-bolt",
        icon: "🔩",
        unit: "<span i18n-key=\"reso-set\">组</span>"
    },
    {
        id: "steel",
        icon: "⬜",
        unit: "kg"
    }
];
const tableSource = $("#resource-template").html();
const tableTemplate = Handlebars.compile(tableSource);
const tableHtml = tableTemplate(tableData);
$("#resource-container").html( tableHtml );
// 解锁最基础的运力资源
$("#transport").removeClass('hidden');
gameData.removeHidden["#transport"] = 1;

$("#buy-laptop").removeClass('hidden');
gameData.removeHidden["#buy-laptop"] = 1;