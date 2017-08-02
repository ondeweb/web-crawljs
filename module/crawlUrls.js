/**
 * Created by kayslay on 5/28/17.
 */
const request = require('request');
const util = require('./util');
const dom = require('./dom');
const _ = require('lodash');
let getDomContents, visitedLinks = [];

const getUrlOut = util.getUrlOut; //util.getUrlOut is used frequently; setting a const for its function

let configured = false;
//the variables to be configured
let fetchSelector, fetchSelectBy, nextSelector, nextSelectBy, formatUrl, timeOut = false,

    //set all defaultDynamicSchemas props when the variable reference is undefined
    defaultDynamicSchemas = {
        fetchSelector: undefined, fetchSelectBy: undefined, nextSelector: undefined, nextSelectBy: undefined
    };

let fetchFn, nextFn;

/**
 *
 * @param urls
 * @param resolve
 */
function crawlUrl(urls, resolve,reject) {
    let visitedUrls = 0;
    let initialLink = [];
    let scrapedData = [];
    if (!Array.isArray(urls)) throw  new Error('the property urls must be an Array');

    urls.forEach((url) => {
        "use strict";
        if (visitedLinks.indexOf(getUrlOut(url)) === -1) { //Todo: improve the visitedLinks check
            visitedUrls++;
            visitedLinks.push(getUrlOut(url));
            req(url);
        } else {
            console.log(`${getUrlOut(url)} has been visited`)
        }
    });

    if (visitedUrls == 0) {//if visited links is 0 it means it
       reject("all the links have been visited")
    }


    /**
     *
     * @param url
     * @private
     */

    function req(url) {

        request(url, function (err, response, body) {
            visitedUrls--;
            if (err) {
                console.error(err.message);
            } else {
                getDomContents = dom(body).getDomContents; //
                scrapedData.push(fetchFromPage(url));
                let newLink = _.uniq(util.sortDataToArray([selectNextCrawlContent(url)]).map(url => {
                    return formatUrl(url)
                }));
                initialLink = initialLink.concat(newLink);
            }

            if (visitedUrls == 0) {
                resolve({fetchedData: scrapedData, nextLinks: initialLink})
            }
        });

    }

}


//returns the scraped data gotten from the page
function fetchFromPage(url) {
    let selector = util.dynamicSelection(url, defaultDynamicSchemas.fetchSelector, fetchSelector);
    let selectBy = util.dynamicSelection(url, defaultDynamicSchemas.fetchSelectBy, fetchSelectBy);

    return getDomContents(selector, selectBy, fetchFn, url);
}

//get the url's to crawl next
function selectNextCrawlContent(url) {
    let selector = util.dynamicSelection(url, defaultDynamicSchemas.nextSelector, nextSelector);
    let selectBy = util.dynamicSelection(url, defaultDynamicSchemas.nextSelectBy, nextSelectBy);
    return getDomContents(selector, selectBy, nextFn, url);
}

/**
 *
 * @param urls
 * @param config
 * @return {Promise}
 */
function crawlUrls(urls, config) {
    "use strict";
    if (!configured) {
        let dynamicSchemas;  // define the variable to hold the dynamic data
        (function (config = {}) {

            ({
                fetchSelector,
                fetchSelectBy,
                nextSelector,
                nextSelectBy,
                fetchFn,
                nextFn,
                timeOut,
                dynamicSchemas={},
                formatUrl = util.formatUrl
            } = config);
            Object.assign(defaultDynamicSchemas, dynamicSchemas)
        })(config);
        configured = true
    }

    return new Promise((resolve, reject) => {
        if (timeOut) {
            setTimeout(() => reject(`timeout after ${timeOut}ms`), timeOut)
        }
        return crawlUrl(urls, resolve,reject)
    })
}


module.exports = {crawlUrls};