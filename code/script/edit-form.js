import {Util} from './util';
import {Events} from './events';

function getPopupContent(inputId, model) {
    let popupContent = {};

    switch (inputId) {
        case 'location':
            popupContent = {
                placeholder: 'City. state & Zip',
                value: model.location
            };
            break;
        case 'phone':
            popupContent = {
                placeholder: 'Phone number',
                value: model.phone
            };

            break;
        case 'website':
            popupContent = {
                placeholder: 'Website',
                value: model.website
            };

            break;
        case 'name':
            popupContent = {
                placeholder: 'Full name',
                value: model.name
            };

            break;
    }

    return popupContent;
}
function destroyPopup(emptyModel) {
    const popupWrappers = EditForm.target.querySelectorAll('.edit-popup-wrapper');

    if (popupWrappers && popupWrappers.length) {
        popupWrappers.forEach((element) => {
            element.parentNode.removeChild(element);
        });
    }
    if (emptyModel) {
        EditForm.state.popupModel = {};
    }

    EditForm.state.popupActive = false;
}
function closeForm() {
    EditForm.target.parentNode.classList.remove('toggle-all-inputs');
    EditForm.state.formModel = {};
}
function toggleForm(wrapper) {
    EditForm.state.formModel = {
        name: EditForm.state.model.name,
        firstName: EditForm.state.model.firstName,
        lastName: EditForm.state.model.lastName,
        location: EditForm.state.model.location,
        phone: EditForm.state.model.phone,
        website: EditForm.state.model.website
    };
    const clickBindElements = wrapper.querySelectorAll('[bind-click]');
    const changeBindElements = EditForm.target.querySelectorAll('[bind-change]');

    if (clickBindElements) {
        clickBindElements.forEach((element) => {
            Util.$on(element, 'click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                const action = event.currentTarget.getAttribute('reference');

                if (action && action === 'save') {
                    if (EditForm.state.formModel.firstName) {
                        EditForm.state.formModel.name.value = EditForm.state.formModel.firstName.value;
                    }
                    if (EditForm.state.formModel.lastName) {
                        EditForm.state.formModel.name.value = EditForm.state.formModel.firstName ? EditForm.state.formModel.firstName.value + ' ' + EditForm.state.formModel.lastName.value : EditForm.state.formModel.lastName.value;
                    }

                    Events.infoDataChange(EditForm.state.formModel, true);
                }

                closeForm();
            });
        });
    }
    if (changeBindElements) {
        changeBindElements.forEach((element) => {
            Util.$on(element, 'keyup', (event) => {
                EditForm.state.formModel[event.currentTarget.getAttribute('reference')].value = event.currentTarget.value;
            });
        });
    }
}
function togglePopup(wrapper, content, html) {
    let dataBindElements = [];
    let clickBindElements = [];
    let changeBindElements = [];
    let popupWrapper = document.createElement('div');

    destroyPopup();

    EditForm.state.popupActive = true;
    popupWrapper.className = 'edit-popup-wrapper content-box-shadow';
    wrapper.appendChild(popupWrapper);

    wrapper.querySelector('.edit-popup-wrapper').innerHTML = html;
    dataBindElements = wrapper.querySelectorAll('[bind-data]');
    clickBindElements = wrapper.querySelectorAll('[bind-click]');
    changeBindElements = wrapper.querySelectorAll('[bind-change]');

    if (dataBindElements) {
        dataBindElements.forEach((element) => {
            Util.bindValue(element, content);
        });
    }
    if (changeBindElements) {
        EditForm.state.popupModel.value = EditForm.state.model[EditForm.state.popupModel.type].value;

        changeBindElements.forEach((element) => {
            Util.$on(element, 'keyup', (event) => {
                EditForm.state.popupModel.value = event.currentTarget.value;
            });
        });
    }
    if (clickBindElements) {
        clickBindElements.forEach((element) => {
            Util.$on(element, 'click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                const action = event.currentTarget.getAttribute('reference');

                if (action && action === 'save') {
                    Events.infoDataChange(EditForm.state.popupModel);
                }

                destroyPopup(true);
            });
        });
    }
}

const EditForm = {
    state: {
        popupModel: {}
    },
    target: {},
    observe: () => {
        let clickableElements = EditForm.target.querySelectorAll('[bind-click]');
        let toggleAllInputs = document.querySelector('#toggle-all-fields');

        if (clickableElements) {
            clickableElements.forEach((element) => {
                Util.$on(element, 'click', (event) => {
                    if (!EditForm.state.popupActive) {
                        const inputId = event.currentTarget.getAttribute('reference');
                        const popupContent = getPopupContent(inputId, EditForm.state.model);
                        const popupHtml = Util.getFile('edit-popup');

                        EditForm.state.popupModel.type = inputId;

                        togglePopup(event.currentTarget, popupContent, popupHtml);
                    } else {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                });
            });
        }
        if (toggleAllInputs) {
            Util.$on(toggleAllInputs, 'click', () => {
                EditForm.target.parentNode.classList.add('toggle-all-inputs');

                toggleForm(toggleAllInputs.parentNode.querySelector('.edit-form__buttons'));
            });
        }
    },
    init: (infoModel) => {
        EditForm.target = document.getElementById('edit-form');

        if (!EditForm.state || !EditForm.target || !infoModel) {
            return;
        }

        EditForm.state.model = infoModel;

        if (infoModel.name && infoModel.name.value) {
            const nameParts = infoModel.name.value.split(" ");

            EditForm.state.model.firstName = {
                value: nameParts[0] ? nameParts[0] : ''
            };
            EditForm.state.model.lastName = {
                value: nameParts[1] ? nameParts[1] : ''
            };
        }
        const dataBindElements = EditForm.target.querySelectorAll('[bind-data]');

        if (dataBindElements && dataBindElements.length) {
            dataBindElements.forEach((element) => {
                Util.bindValue(element, infoModel, true);
            });
        }

        EditForm.observe();
    }
};

export {EditForm};