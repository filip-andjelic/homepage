import {Util} from './util';

export default class Model {
    constructor() {
        this.data = {};

        this.data.controlTabs = {
            about: {
                title: 'About',
                selected: true,
                id: 'about'
            },
            settings: {
                title: 'Settings',
                selected: false,
                id: 'settings'
            },
            1: {
                title: 'Option1',
                selected: false,
                id: '1'
            },
            2: {
                title: 'Option2',
                selected: false,
                id: '2'
            },
            3: {
                title: 'Option3',
                selected: false,
                id: '3'
            }
        };
        this.data.info = {
            name: {
                value: 'Jessica Parker'
            },
            location: {
                value: 'Newport Beach, CA'
            },
            phone: {
                value: '(949)325-68594'
            },
            website: {
                value: 'www.seller.com'
            }
        };
    };
    setControlTabs(tabs) {
        this.data.controlTabs = tabs;
    };
    setInfo(model, replace) {
        if (replace) {
            this.data.info = model;

            return;
        }
        this.data.info[model.type].value = model.value;
    };
    setModelData(data) {
        Util.forObjectKeys(data.info, (value, key) => {
            if (this.data.info[key]) {
                this.data.info[key] = value;
            }
        });
    };
    getControlTabs() {
        return this.data.controlTabs;
    };

    getData() {
        return this.data;
    };
}