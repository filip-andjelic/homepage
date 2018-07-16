export default class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    };
    setView(hash) {
        // For implementation of custom page redirection.
        const validURL = /^#\/[\d]{2}\/[\d]{4}$/.test(hash);

        if (validURL) {
            const matches = hash.match(/^#\/([\d]{2})\/([\d]{4})$/);
            // @TODO Continue from here <* REDIRECTION *>
        }

        this.render();
    };
    controlTabsChange(tabs) {
        this.model.setControlTabs(tabs);
        this.view.controlTabsChange(tabs, this.model.getData());

        this.updateLocalStorage(this.model.getData());
    };
    infoModelChange(model, replace) {
        this.model.setInfo(model, replace);
        this.view.infoModelChange(model, replace);

        this.updateLocalStorage(this.model.getData());
    };
    updateLocalStorage(data) {
        if (localStorage) {
            localStorage.setItem('socialNetworkData', JSON.stringify(data));
        }
    };
    checkLocalStorage() {
        if (localStorage && localStorage.getItem('socialNetworkData')) {
            this.model.setModelData(JSON.parse(localStorage.getItem('socialNetworkData')));

            return true;
        }

        return false;
    };

    render() {
        const existingData = this.checkLocalStorage();

        this.view.render(this.model.getData());
        if (existingData) {
            this.controlTabsChange(this.model.getControlTabs());
        }
    };
}