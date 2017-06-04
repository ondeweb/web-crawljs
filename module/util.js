/**
 * Created by kayslay on 4/23/17.
 */
let _ = require('lodash');
let path = require('path');
let urlModule = require('url');


/**
 * @description returns true if the keys of two objects match and false if otherwise
 * @param obj1 first object
 * @param obj2 second object
 * @return {boolean}
 */
function keyMatch(obj1, obj2) {
    let key1 = Object.keys(obj1).sort();
    let key2 = Object.keys(obj2).sort();
    return _.isEqual(key1, key2);
}

/**
 * @description converts a relative url to an absolute url
 * @param url the current url
 * @param urlPath the url path to resolve
 * @return {string}
 */
function toAbsoluteUrl(url, urlPath) {
    let getUrl = getUrlOut(url);
    let parsedUrl = urlModule.parse(getUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}${path.resolve(url, urlPath)}${parsedUrl.search || ''}`
        .replace(/(\w|\d)\/\//g, "$1\/")
        .replace(/\/?#.+$/, '');
}

/**
 * @description returns the url string
 * if the url param is an object get the return the url property
 * @param url {String|Object}
 * @return {string}
 */
function getUrlOut(url) {
    if (typeof url === 'string') {
        return url;
    } else if (typeof url == 'object') {
        return url.url;
    }
}

/**
 * @description coverts an object to an array
 * @param data
 * @return {*}
 */
function sortDataToArray(data) {
    return data.reduce((acc, item) => {
        "use strict";
        let packedItem = [];
        for (let i in item) {
            packedItem = packedItem.concat(item[i]);
        }
        return acc.concat(packedItem)
    }, [])
}

//Todo: add what will reformat the urls, the selectBy e.t.c.
/**
 * @description returns a url; the url can either be a string or an Object supported by request package
 * @param {String} url
 * @return {String|Object}
 */
function formatUrl(url) {
    return url;
}

/**
 *
 * @param url
 * @param {Object} dynamic the object that will replace the default selector
 * @param {Object} defaultSelection the default selection
 * @return {*}
 */
function dynamicSelection(url, dynamic, defaultSelection) {
    "use strict";
    //for now lets use a stringified url
    //todo: fix the formating url
    if (dynamic) {
        let formatedUrl = getUrlOut(url);
        for (let x of dynamic) {
            if (x.url.test(formatedUrl)) {
                return x.schema;
            }
        }
    }
    return defaultSelection
}

let util = {
    keyMatch,
    getUrlOut,
    sortDataToArray,
    toAbsoluteUrl,
    formatUrl,
    dynamicSelection
};
exports = module.exports = util;