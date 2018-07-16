const Events = {
    controlTabClick: (tabs) => {
        if (tabs && Events.controller) {
            Events.controller.controlTabsChange(tabs);
        }
    },
    infoDataChange: (model, replace) => {
        if (model && Events.controller) {
            Events.controller.infoModelChange(model, replace);
        }
    },
    init: (controller) => {
        Events.controller = controller;
    }
};

export {Events};