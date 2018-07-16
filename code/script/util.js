function cleanImportedHtml(html) {
    return html.replace('module.exports = "', '')
        .replace('";', '')
        .replace(/  /g, '')
        .replace(/\n/g, '');
}

export const Util = {
    cachedFiles: {},
    $on: (target, event, handler) => {
        return target.addEventListener(event, handler);
    },
    forObjectKeys: (object, callback) => {
        for (let key in object) {
            callback(object[key], key);
        }
    },
    getFile: (name) => {
        return cleanImportedHtml(require('html-loader!./html/' + name + '.html'))
    },
    bindValue: (element, content, lookForValue) => {
        const contentProperty = element.getAttribute('reference');
        const value = content[contentProperty] ? content[contentProperty].value : '';

        if (!contentProperty) {
            return;
        }

        if (element.type === 'text') {
            element.value = value;
        } else {
            element.textContent = lookForValue ? value : content[contentProperty];
        }
    }
};