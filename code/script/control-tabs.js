import {Util} from './util';
import {Events} from './events';

const ControlTabs = {
    state: {},
    target: {},
    selectTab: (tab, shouldUpdateData) => {
        /*let currentlySelectedTabElement = ControlTabs.target.querySelector('.control-tabs__item--selected');
        let tabElement = ControlTabs.target.querySelector('[reference="'+ tab.id +'"]');

        if (currentlySelectedTabElement) {
            currentlySelectedTabElement.classList.remove('control-tabs__item--selected');
        }
        if (tabElement) {
            tabElement.classList.add('control-tabs__item--selected');
        }
        if (shouldUpdateData) {
            Util.forObjectKeys(ControlTabs.state.tabs, (tab) => {
                tab.selected = false;
            });
            ControlTabs.state.tabs[tab.id].selected = true;

            Events.controlTabClick(ControlTabs.state.tabs);
        }*/
    },
    observe: () => {
        let clickableElements = ControlTabs.target.querySelectorAll('[bind-click]');

        if (clickableElements) {
            clickableElements.forEach((element) => {
                Util.$on(element, 'click', (event) => {
                    const tabId = event.currentTarget.getAttribute('reference');

                    Util.forObjectKeys(ControlTabs.state.tabs, (tab) => {
                        if (tab.id === tabId) {
                            ControlTabs.selectTab(tab, true);
                        }
                    });
                });
            });
        }
    },
    init: (controlTabs) => {
        ControlTabs.target = document.getElementById('control-tabs');

        if (ControlTabs.state && !ControlTabs.state.tabs) {
            ControlTabs.state.tabs = controlTabs;
        }

        Util.forObjectKeys(ControlTabs.state.tabs, (tab) => {
            if (tab.selected) {
                ControlTabs.selectTab(tab);
            }
        });

        ControlTabs.observe();
    }
};

export {ControlTabs};