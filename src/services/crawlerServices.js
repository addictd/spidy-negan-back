const puppeteer = require('puppeteer');
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import * as c_book from '../utils/crawl_book';

const crawlerServices = {
    query_tag: promisify(queryTag),
    fetch_more_stories_list : promisify(fetchMoreStories),
    crawl_article: promisify(crawlArticle)
}


async function queryTag({ tag }, cb) { // for search by tag
    // try {
    //     if (!tag) throw errMsg.INCOMPLETE_ARGUMENTS;

    //     const browser = await puppeteer.launch({ headless: true });
    //     const page = await browser.newPage();

    //     await page.goto(c_book.tag_search_url_available + tag);
    //     const tags = await page.$$eval('a[data-action-source="search"]',
    //         elems => elems.map(item => ({
    //             tag: item.textContent,
    //             link: item.getAttribute('href')
    //         }))
    //     );
    //     await browser.close();
    //     return cb(null, tags);

    // } catch (err) {
    //     return cb(errMsg._ERR(err));
    // }
}



async function fetchMoreStories({ tag, count }, cb) {
    try {
        if (!tag || !count ) throw errMsg.INCOMPLETE_ARGUMENTS;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const _url = c_book.story_list_url + tag;
        await page.goto(_url);

        const _selector = c_book.story_list_selector;
        await page.waitFor(_selector);

        let fetched_links = await c_book.generateLinks({ page, selector: _selector });
        
        while(fetched_links.length < count){
            console.log('while');
            const fetch_more = await c_book.fetchmorelinks({page, fetched_links, selector : _selector});
            fetched_links =  await c_book.generateLinks({page, selector : _selector });
        }

        await browser.close();
        return cb(null, fetched_links);

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

            const startTime = (new Date()).getTime();
            await page.goto(url);

            const {article_selector, article_body_selector } = c_book; 
            try {
                await page.waitFor( article_selector , options);
                const elem = await page.$eval( article_selector, elem => elem.textContent);
                article = JSON.parse(elem);
            } catch (err) { }

            try {
                await page.waitFor( article_body_selector , options);
                const blog = await page.$$eval( article_body_selector, elems => elems.map(elem => elem.textContent));
                article.blog = blog.reduce((result, item, i) => (result + item), '');
            } catch (err) { };


            const endTime = (new Date()).getTime();
            await browser.close();

            article.fetch_time = endTime - startTime;
        } catch (err) {
            article.err = true;
            article.identifier ="";
        }


        return cb(null, article);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}



export default crawlerServices;