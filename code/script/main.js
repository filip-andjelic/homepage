import {Util} from './util';
import {Events} from './events';
import View from './view';
import Model from './model';
import Controller from './controller';

class App {
  constructor() {
    const model = new Model();
    const view = new View();

    this.controller = new Controller(model, view);
    Events.init(this.controller);
  };
}

const app = new App();

const setView = () => {
  app.controller.setView(document.location.hash);
};

Util.$on(window, 'load', setView);
Util.$on(window, 'hashchange', setView);