console.log('加载htmlgen.js')

// 买载具模板
const buttonVehicleData = [
    {
        id: "mini-truck",
        price: marketList["buy-mini-truck"].price.toLocaleString() + " $",
        installment:
            marketList["buy-mini-truck"].installPrice.toLocaleString() + " $ * " +
            marketList["buy-mini-truck"].installMonth + "<span i18n-key=\"mkt-month\">月</span>"
    },
    {
        id: "semi-truck",
        price: marketList["buy-semi-truck"].price.toLocaleString() + " $",
        installment:
            marketList["buy-semi-truck"].installPrice.toLocaleString() + " $ * " +
            marketList["buy-semi-truck"].installMonth + "<span i18n-key=\"mkt-month\">月</span>"
    },
    {
        id: "excavator",
        price: marketList["buy-excavator"].price.toLocaleString() + " $",
        installment:
            marketList["buy-excavator"].installPrice.toLocaleString() + " $ * " +
            marketList["buy-excavator"].installMonth + "<span i18n-key=\"mkt-month\">月</span>"
    }
];
generateHtmlFromTemplate("buy-vehicle", buttonVehicleData);

// 买地产模板
const buttonFieldData = [
    {
        id: "warehouse",
        price: marketList["buy-warehouse"].price.toLocaleString() + " $",
        installment:
            marketList["buy-warehouse"].installPrice.toLocaleString() + " $ * " +
            marketList["buy-warehouse"].installMonth + "<span i18n-key=\"mkt-month\">月</span>"
    }
];
generateHtmlFromTemplate("buy-field", buttonFieldData);

// 雇佣模板
const employData = [
    {
        id: "zombie",
        icon: "🧟",
        salary: employList["employ-zombie"].salary.toLocaleString() + " $ /<span i18n-key=\"mkt-month\">月</span>",
    },
    {
        id: "vampire",
        icon: "🧛",
        salary: employList["employ-vampire"].salary.toLocaleString() + " $ /<span i18n-key=\"mkt-month\">月</span>",
    }
];
generateHtmlFromTemplate("employ", employData);

// 建造模板
const buildData = [
    {
        id: "office",
        input: buildList["build-office"].constructInput[0] + "~" + buildList["build-office"].constructInput[1],
        total: buildList["build-office"].constructTotal,
    }
];
generateHtmlFromTemplate("build", buildData);

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
generateHtmlFromTemplate("vehicle", vehicleData);

// 地产展示模板
const fieldData = [
    {
        id: "warehouse"
    }
];
generateHtmlFromTemplate("field", fieldData);

// 建筑展示模板
const buildingData = [
    {
        id: "office"
    }
];
generateHtmlFromTemplate("building", buildingData);

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
generateHtmlFromTemplate("work-force", workForceData);

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
generateHtmlFromTemplate("resource", tableData);

function generateHtmlFromTemplate(name, data) {
    const source = $(`#${name}-template`).html();
    const template = Handlebars.compile(source);
    const html = template(data);
    $(`#${name}-container`).html(html);
}

// 解锁最基础的运力资源
$("#transport").removeClass('hidden');
gameData.removeHidden["#transport"] = 1;

// 执行翻译过程
$("[i18n-key]").each(translateElement);
$("[i18n-key-int]").each(translateElementInt);

function translateElementInt() {
    const key = $(this).attr("i18n-key-int");
    // console.log(key)
    // console.log(locale)
    const translation = translations[locale][key];
    $(this).html(translation);
}
function translateElement() {
    const key = $(this).attr("i18n-key");
    // console.log(key)
    // console.log(locale)
    const translation = translations[locale][key];
    $(this).html(translation);
}