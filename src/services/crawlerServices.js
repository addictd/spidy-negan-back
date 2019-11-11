const puppeteer = require('puppeteer');
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import * as c_book from '../utils/crawl_book';

const crawlerServices = {
    query_tag: promisify(queryTag),
    open_by_tag : promisify(openByTag),
    crawl_article : promisify(crawlArticle)
}


async function queryTag({ tag }, cb) {
    try {
        if (!tag) throw errMsg.INCOMPLETE_ARGUMENTS;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(c_book.tag_search_url + tag);
        const tags = await page.$$eval('a[data-action-source="search"]',
            elems => elems.map(item => ({
                tag: item.textContent,
                link: item.getAttribute('href')
            }))
        );
        await browser.close();
        return cb(null, tags);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}

async function openByTag({ tag }, cb) {
    try {
        if (!tag) throw errMsg.INCOMPLETE_ARGUMENTS;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const _url = c_book.open_url_by_tag(tag);
        await page.goto(_url);

        const links = await page.$$eval('.js-tagStream .postArticle-readMore a', elems => elems.map(item => item.getAttribute('href')));
        // console.log('links : ', links);

        await browser.close();
        return cb(null, links);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}

async function crawlArticle({ url }, cb) {
    try {
        if (!url) throw errMsg.INCOMPLETE_ARGUMENTS;
        const options = { timeout: 3000 };
        let article = {};

        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(url);
            

            try{
                await page.waitFor('head script[type="application/ld+json"]', options);
                const elem = await page.$eval('head script[type="application/ld+json"]', elem=> elem.textContent);
                // console.log('here: ', elem);
                article = JSON.parse(elem);
                // console.log('parsed', parsed);
            }catch(err){}

            try {
                await page.waitFor('article section', options);
                const blog = await page.$$eval('article section', elems => elems.map(elem => elem.textContent));
                article.blog = blog.reduce((result, item, i) => (result + item), '');
            } catch (err) { };


            await browser.close();

        } catch (err) {
            article.title = "Unable to load page."
        }

        
        return cb(null, article);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}

export default crawlerServices;