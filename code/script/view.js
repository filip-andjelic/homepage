import {App} from './app';
import {Util} from "./util";

export default class View {
    constructor() {
        this.el = document.getElementById('App');
    };
    controlTabsChange(tabs, data) {
        let selectedTab = {};

        Util.forObjectKeys(tabs, (tab) => {
            if (tab.selected) {
                selectedTab = tab;
            }
        });

        App.switchTabContent(selectedTab);
        App.updateDataBindings(data);
    };
    infoModelChange(model, replace) {
        App.updateInfoModel(model, replace);
    };

    render(data) {
        this.el.innerHTML = App.render();
        App.loadApp(data);
    };
}