let cheerio = require('cheerio');
let expect = require('chai').expect;
let Crawler = require('../index')({
    fetchSelector: {title: "title"},
    fetchSelectBy: {title: 'text'},
    nextSelector: {links: 'a[href^="/"]'},
    nextSelectBy: {links: ['attr', 'href']},
    fetchFn: (err, data, url) => {
        if (err) console.error(err.message);
        expect(data).to.be.an('object');
    },
    nextFn: function (err,data, url) {
        // console.log(Crawler.getPrivateProp('initialLinks'))
    },
    loop: 4,
    urls: ['http://localhost', 'http://localhost']
});


describe('testing the Crawler', function () {
    describe('testing the getDomContent method', function () {
        it('should return an object with the data', function () {
            Crawler.CrawlAllUrl();
        });
    });

});

