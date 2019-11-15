const puppeteer = require('puppeteer');
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import * as c_book from '../utils/crawl_book';

const crawlerServices = {
    fetch_more_stories_list : promisify(fetchStoriesList),
    crawl_article: promisify(crawlArticle),
    fetch_response : promisify(fetchResponse)
}



async function fetchStoriesList({ tag, count }, cb) {
    try {
        if (!tag || !count ) throw errMsg.INCOMPLETE_ARGUMENTS;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const _url = c_book.story_list_url + tag;
        await page.goto(_url);

        const _tags_selector = c_book.story_related_tag_selector;
        // await page.waitFor(_tags_selector);
        const related_tags = await page.$$eval(_tags_selector, elems => elems.map(elem => elem.textContent.toLowerCase() ))


        const _selector = c_book.story_list_selector;
        // await page.waitFor(_selector);

        let fetched_links = await c_book.generateLinks({ page, selector: _selector });
        
        while(fetched_links.length < count){
            console.log('while');
            const fetch_more = await c_book.fetchmorelinks({page, fetched_links, selector : _selector});
            fetched_links =  await c_book.generateLinks({page, selector : _selector });
        }
        fetched_links = fetched_links.map(item => {
            item.tag = tag;
            return item;
        })
        await browser.close();
        return cb(null, {links : fetched_links, related_tags});

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


async function crawlArticle({ url, tag }, cb) {
    try {
        if (!url) throw errMsg.INCOMPLETE_ARGUMENTS;
        const options = { timeout: 30000 };
        let article = {};

        try {
            
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            const startTime = (new Date()).getTime();
            await page.goto(url);

            const {article_selector, article_body_selector } = c_book; 
            try {
                // await page.waitFor( article_selector , options);
                const elem = await page.$eval( article_selector, elem => elem.textContent);
                article = JSON.parse(elem);
            } catch (err) { }

            try {
                // await page.waitFor( article_body_selector , options);
                const blog = await page.$$eval( article_body_selector, elems => elems.map(elem => elem.textContent));
                article.blog = blog.reduce((result, item, i) => (result + item), '');
            } catch (err) { };
            
            try {
                await page.waitFor( article_body_selector , options);
                await page.waitFor( article_body_selector + ' img', options);
                const blog_html = await page.$$eval( article_body_selector , elems => elems.map(elem => elem.innerHTML ));
                article.blog_html = blog_html.reduce((result, item, i) => (result + item), '');

            } catch (err) { };


            // try {
            //     await page.waitFor( 'article' , options);
            //     await page.waitFor( 'article img' , options);
            //     const blog_html = await page.$$eval( 'article ', elems => elems.map(elem => elem.innerHTML ));
            //     article.blog_html = blog_html.reduce((result, item, i) => (result + item), '');
            // } catch (err) { };

            try{
                const styles = await page.evaluate((article) => {
                    let obj = [];
                    const sty = document.styleSheets;
                    for(let i=0 ; i< sty.length; i++){
                        obj[i] = sty[i].ownerNode.innerText;
                    }
                    return obj;
                }, article);

                
                article.blog_style = styles;
            }catch(err){}

            
            const endTime = (new Date()).getTime();
            await browser.close();

            article.fetch_time = endTime - startTime;
            article.crawl_tag = tag;
            article.crawl_status = 'success';
        } catch (err) {
            article.crawl_status = 'err';
            article.identifier ="";
        }

        return cb(null, article);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}



async function fetchResponse({ id}, cb) {
    try {
        if (!id ) throw errMsg.INCOMPLETE_ARGUMENTS;

        const options = { timeout: 30000 };
        let blog_response = '';

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            const url = c_book.response_link(id);
            console.log('url========', url);
            page.goto(url);
            await page.waitFor( '.js-responsesStreamOther .js-streamItem' , options); 
            blog_response = await page.$eval( '.js-responsesStreamOther ', elem => elem.innerHTML );
            
        } catch (err) { };

        await browser.close();
        return cb(null, blog_response);

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


export default crawlerServices;